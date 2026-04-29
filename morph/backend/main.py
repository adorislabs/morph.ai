from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import trafilatura
import google.generativeai as genai
import json
import os
import re
import base64
import asyncio
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
CAUDIT_CACHE_DIR = Path(__file__).parent / ".audit_cache"
CAUDIT_CACHE_DIR.mkdir(exist_ok=True)

def _cache_key(url: str) -> str:
    return hashlib.sha256(url.lower().rstrip('/').encode()).hexdigest()[:16]

def _cache_path(url: str) -> Path:
    return CAUDIT_CACHE_DIR / f"{_cache_key(url)}.json"

def _load_cache(url: str):
    p = _cache_path(url)
    if p.exists():
        try:
            return json.loads(p.read_text())
        except Exception:
            return None
    return None

def _save_cache(url: str, data: dict):
    p = _cache_path(url)
    p.write_text(json.dumps({**data, "_url": url}))
app = FastAPI(title="morph.ai")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"}


class PreviewRequest(BaseModel):
    url: str


class PersonalizeRequest(BaseModel):
    url: str
    persona: str


async def fetch_text(url: str):
    try:
        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
            r = await client.get(url, headers=HEADERS)
            r.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(400, f"HTTP {e.response.status_code} fetching URL")
    except Exception as e:
        raise HTTPException(400, f"Cannot reach URL: {e}")

    html = r.text
    text = trafilatura.extract(html, include_comments=False, include_tables=True, favor_recall=True)

    if not text or len(text.strip()) < 80:
        meta_bits = []
        for pattern in [
            r'<title[^>]*>(.*?)</title>',
            r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']',
            r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']',
            r'<meta[^>]*property=["\']og:title["\'][^>]*content=["\'](.*?)["\']',
            r'<meta[^>]*property=["\']og:description["\'][^>]*content=["\'](.*?)["\']',
        ]:
            m = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
            if m:
                val = m.group(1).strip()
                if val:
                    meta_bits.append(val)

        body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.IGNORECASE | re.DOTALL)
        body_html = body_match.group(1) if body_match else html
        raw_text = re.sub(r'<[^>]+>', ' ', body_html)
        raw_text = re.sub(r'\s+', ' ', raw_text).strip()[:3000]

        combined = (' '.join(meta_bits) + ' ' + raw_text).strip()
        if len(combined) > 50:
            text = combined
        else:
            domain = urlparse(url).netloc.replace('www.', '')
            text = (
                f"[SPARSE CONTENT - JavaScript SPA] URL: {url}. Domain: {domain}. "
                f"Page title: {combined if combined else domain}. "
                "No server-rendered body text. Infer product, value prop, and target market from URL structure."
            )

    return text, html


def extract_headings(html: str):
    headings = []
    for tag in ['h1', 'h2']:
        for m in re.finditer(rf'<{tag}[^>]*>(.*?)</{tag}>', html, re.IGNORECASE | re.DOTALL):
            clean = re.sub(r'<[^>]+>', '', m.group(1)).strip()
            if clean and len(clean) > 2:
                headings.append(clean[:80])
    return headings[:12]


def extract_images(html: str) -> list:
    """Extract og:image and top content img URLs from HTML."""
    images = []
    seen = set()

    # Priority 1: og:image — brand's chosen representative image
    for pat in [
        r'<meta[^>]*property=["\']og:image["\'][^>]*content=["\'](https?://[^\s"\']{10,})["\']',
        r'<meta[^>]*content=["\'](https?://[^\s"\']{10,})["\'][^>]*property=["\']og:image["\']',
    ]:
        m = re.search(pat, html, re.IGNORECASE)
        if m:
            url = m.group(1).strip().split('?')[0]  # strip query params for cleaner URL
            if url not in seen:
                images.append({"context": "og_image", "url": m.group(1).strip()})
                seen.add(url)
            break

    # Priority 2: prominent img tags (skip tracking pixels, icons)
    SKIP = ('1x1', 'pixel.gif', 'tracking.', 'beacon.', 'favicon', '.svg', 'sprite', 'spacer')
    for m in re.finditer(r'<img[^>]+src=["\'](https?://[^\s"\']{12,})["\']', html, re.IGNORECASE):
        src = m.group(1).strip()
        if src in seen:
            continue
        if any(x in src.lower() for x in SKIP):
            continue
        images.append({"context": "content_img", "url": src})
        seen.add(src)
        if len(images) >= 4:
            break

    return images[:4]


async def download_image_b64(url: str, max_w: int = 900) -> str | None:
    """Download an image URL and return base64 JPEG, resized to max_w wide."""
    try:
        async with httpx.AsyncClient(timeout=4, follow_redirects=True) as client:
            r = await client.get(url, headers=HEADERS)
        if r.status_code != 200:
            return None
        ct = r.headers.get("content-type", "")
        if "image" not in ct and not any(ext in url.lower() for ext in (".jpg", ".jpeg", ".png", ".webp")):
            return None
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(r.content)).convert("RGB")
        if img.width > max_w:
            ratio = max_w / img.width
            img = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
        # Also cap height to stay within Gemini's 8000px dimension limit
        max_h = 7000
        if img.height > max_h:
            ratio = max_h / img.height
            img = img.resize((int(img.width * ratio), max_h), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=78, optimize=True)
        return base64.b64encode(buf.getvalue()).decode()
    except Exception:
        return None


def _extract_text_from_html(html: str, url: str) -> str:
    """Extract text from HTML string (meta tags + body fallback for SPAs)."""
    text = trafilatura.extract(html, include_comments=False, include_tables=True, favor_recall=True)
    if text and len(text.strip()) >= 80:
        return text
    meta_bits = []
    for pattern in [
        r'<title[^>]*>(.*?)</title>',
        r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']',
        r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']',
        r'<meta[^>]*property=["\']og:title["\'][^>]*content=["\'](.*?)["\']',
        r'<meta[^>]*property=["\']og:description["\'][^>]*content=["\'](.*?)["\']',
    ]:
        m = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
        if m:
            val = m.group(1).strip()
            if val:
                meta_bits.append(val)
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.IGNORECASE | re.DOTALL)
    body_html = body_match.group(1) if body_match else html
    raw_text = re.sub(r'<[^>]+>', ' ', body_html)
    raw_text = re.sub(r'\s+', ' ', raw_text).strip()[:3000]
    combined = (' '.join(meta_bits) + ' ' + raw_text).strip()
    if len(combined) > 50:
        return combined
    domain = urlparse(url).netloc.replace('www.', '')
    return f"[SPARSE CONTENT - SPA] URL: {url}. Domain: {domain}. Infer from URL structure."


async def playwright_extract(url: str):
    """Single Playwright session: JS-rendered HTML + 3 viewport screenshots at scroll positions."""
    try:
        from playwright.async_api import async_playwright
        from PIL import Image
        import io

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page(viewport={"width": 1440, "height": 900})
            await page.goto(url, timeout=25000, wait_until="load")
            await asyncio.sleep(1.8)

            rendered_html = await page.content()
            screenshots_b64 = []

            for scroll_pct in [0, 0.38, 0.72]:
                if scroll_pct > 0:
                    await page.evaluate(f"window.scrollTo(0, document.body.scrollHeight * {scroll_pct})")
                    await asyncio.sleep(0.4)
                png = await page.screenshot(full_page=False, type="png")
                img = Image.open(io.BytesIO(png)).convert("RGB")
                if img.width > 1280:
                    ratio = 1280 / img.width
                    img = img.resize((1280, int(img.height * ratio)), Image.LANCZOS)
                buf = io.BytesIO()
                img.save(buf, format="JPEG", quality=80, optimize=True)
                screenshots_b64.append(base64.b64encode(buf.getvalue()).decode())

            await browser.close()
        return rendered_html, screenshots_b64
    except Exception:
        return None, []


@app.post("/preview")
async def preview(req: PreviewRequest):
    text, html = await fetch_text(req.url)
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    title = lines[0] if lines else "Unknown"
    excerpt = " ".join(lines[1:10])[:400] if len(lines) > 1 else ""
    domain = urlparse(req.url).netloc.replace('www.', '').split('.')[0].capitalize()
    return {"title": title, "excerpt": excerpt, "domain": domain}


SYSTEM = (
    "You are a senior CRO strategist and conversion designer. "
    "Return raw JSON only. No markdown, no backticks, no explanation. "
    "One JSON object. Nothing else. "
    "ALL data field values MUST be plain strings — never objects or arrays of objects as string values."
)

MODULE_MENU = """HERO (always first): cinematic, split-code, stat-driven, editorial, minimal-centered, asymmetric-bold, manifesto, vs-comparison, product-hero, split-benefits. data:{title,subtitle,cta_text,supporting_element} — all strings
PROBLEM (skeptical/analytical only): pain-agitate, before-after, empathy-lead, data-backed, narrative-split, pain-cards. data:{headline,body,stat} — all strings
FEATURES: grid-3col, grid-2col, side-by-side, checklist, terminal-log, comparison-table, bento-grid, magazine-split, icon-ribbon. data:{headline,items:[{title,description,icon_hint}]} max 6 items
SOCIALPROOF: quote-cards, logo-ticker, case-study, stat-wall, review-feed, masonry, split-featured. data:{headline,items:[{content,attribution}]} max 5 items — attribution = company name only
PRICING: tiered-table, single-focus, comparison, usage-based, contact-sales. data:{headline,plans:[{name,price,description,cta_text,highlighted}]} max 3 plans, highlighted="true"/"false"
CTA (ALWAYS the very last module): full-bleed-centered, split-with-visual, inline-minimal, urgency-banner, founder-note, proof-split, email-capture. data:{headline,subtext,button_text,secondary_action} — all plain strings
FAQ: accordion, two-column, chatlike, objection-handler. data:{headline,items:[{question,answer}]} max 5 items
HOWITWORKS: numbered-steps, visual-flow, timeline, command-line, alternating-visual, split-steps. data:{headline,steps:[{title,description}]} max 4 steps
TRUST: metrics-bar, certifications, media-mentions, guarantee. data:{headline,items:[{label,value}]} max 4 items
TEAM: founder-cards, advisor-strip. data:{headline,members:[{name,title,bio}]} max 3 members
GALLERY: masonry-grid, spotlight, film-strip. data:{headline,caption} — use for image-heavy sites; site images auto-provided by backend
SHOWCASE: browser-chrome, mockup-split, feature-highlight. data:{headline,subtitle,feature_tags} — for SaaS/product screenshots; site image auto-provided; feature_tags=["tag1","tag2","tag3"]
METRICS: stat-cards, pulse-bar, comparison-bar. data:{headline,stats:[{value,label,change}]} max 4 stats; change="" or "+X% YoY" or "↑ vs last year"
BENEFITS: icon-list, two-col-grid, horizontal-strip, alternating-split, split-hero. data:{headline,items:[{title,description,icon_hint}]} max 6 items; use instead of FEATURES for emotional/consumer audiences"""

ANTI_STEREOTYPE = """
ANTI-STEREOTYPE MANDATE (mandatory — violating this is a CRO failure):
THEME anti-cliches:
- Technical/Dev: AVOID dark terminal green. USE editorial-light+cyan+mono dense OR deep-black+teal+compact
- Luxury/premium: AVOID gold+serif+white. USE deep-black+spacious+single-drama-color+cinematic motion
- CFO/finance: AVOID corporate blue. USE warm-paper+stat-driven+elevated surface+teal
- Early adopter: AVOID rainbow hype. USE deep-black+asymmetric-bold+violet/cyan+expressive
- Enterprise IT: AVOID plain navy. USE high-contrast+outlined+comparison-table+none motion
- VC/investor: AVOID startup purple. USE editorial-light+data-dense+stat-driven+slate
- Consumer/general: AVOID feature lists first. USE cinematic hero+emotion first+visual-flow
- Student: AVOID corporate. USE playful+rounded+emerald/cyan+expressive motion
- Small business: AVOID generic. USE warm-paper OR light+emerald+rounded+numbered-steps

BACKGROUND MODE RULE (mandatory): Only developer, hacker, enterprise-security, and night-mode personas may use dark/deep-black/high-contrast.
For ALL other personas (executive, CFO, consumer, student, luxury, general, marketer, creative, VC): background_mode MUST be warm-paper, editorial-light, or light — dark is a CRO failure for non-technical audiences.

LAYOUT DIVERSITY MANDATE (mandatory — violating this = boring, ineffective page):
- NEVER use only centered, full-width text blocks. Every page must have at least 3 split/asymmetric layouts.
- For HERO: strongly prefer product-hero, split-benefits, editorial, asymmetric-bold, split-code over minimal-centered
- For FEATURES: strongly prefer bento-grid, magazine-split, side-by-side over grid-3col. Use grid-3col only as last resort.
- For BENEFITS: strongly prefer alternating-split, split-hero, icon-list over horizontal-strip
- For HOWITWORKS: strongly prefer alternating-visual, split-steps, visual-flow over numbered-steps
- For SOCIALPROOF: strongly prefer masonry, split-featured, case-study over quote-cards
- For PROBLEM: strongly prefer narrative-split, before-after, data-backed over plain pain-agitate
- For CTA: strongly prefer proof-split, split-with-visual, urgency-banner over default centered
- The page must feel like a magazine layout with varied visual rhythm — not a PowerPoint with centered slides.

MODULE SELECTION anti-cliches (vary module set per persona):
- Dev/technical: HERO(split-code OR product-hero), FEATURES(terminal-log OR bento-grid OR magazine-split), SHOWCASE(browser-chrome) — avoid cinematic hero
- Student/campus: GALLERY(masonry-grid OR spotlight) near top, HOWITWORKS(alternating-visual), BENEFITS(split-hero) — avoid PRICING first
- CFO/finance: HERO(stat-driven), PROBLEM(data-backed OR narrative-split), METRICS, TRUST, PRICING — data before emotion
- Consumer/emotional: HERO(cinematic OR product-hero), BENEFITS(alternating-split) NOT FEATURES, SOCIALPROOF(masonry OR split-featured) — avoid stat-wall
- VC/investor: HERO(editorial OR stat-driven), METRICS, TEAM, TRUST — facts over features
- Enterprise: TRUST near top, FEATURES(comparison-table OR magazine-split), PRICING(contact-sales), FAQ — security first
- Marketing/creative: HERO(manifesto OR vs-comparison), SOCIALPROOF(masonry), CTA(full-bleed-centered) — bold
Each persona MUST produce different module ORDER, different module IDs, different variants — not just a color swap."""


COPY_MANDATE = """COPY QUALITY MANDATE (violations = rejected):
BANNED PHRASES (never use any of these): "Transform your workflow", "Streamline your process", "Boost productivity", "Take it to the next level", "Unlock your potential", "Seamlessly integrate", "All-in-one solution", "Game-changer", "Revolutionary", "Best-in-class", "Cutting-edge", "Next-generation", "Empower your team", "Supercharge your", "Robust solution"
REQUIRED:
- Every headline must reference SPECIFIC content from the site (product name, actual feature, real number)
- Use the site's own terminology from the CONTENT and HEADINGS provided — do not invent
- Persona angle: CFO = ROI numbers + payback; Dev = technical precision + code speed; Student = outcome clarity; Consumer = emotion + benefit
- Hero tagline must state WHAT the product does specifically, not vaguely ("Deploy SSL certs in 90 seconds" not "Accelerate security")"""

LANG_MAP = {
    'spanish': 'Spanish', 'french': 'French', 'hindi': 'Hindi', 'arabic': 'Arabic',
    'german': 'German', 'italian': 'Italian', 'portuguese': 'Portuguese', 'japanese': 'Japanese',
    'chinese': 'Chinese (Simplified)', 'mandarin': 'Chinese (Simplified)', 'korean': 'Korean',
    'russian': 'Russian', 'turkish': 'Turkish', 'dutch': 'Dutch', 'polish': 'Polish',
    'swedish': 'Swedish', 'danish': 'Danish', 'norwegian': 'Norwegian', 'thai': 'Thai',
    'vietnamese': 'Vietnamese', 'indonesian': 'Indonesian', 'tagalog': 'Filipino',
    'punjabi': 'Punjabi', 'panjabi': 'Punjabi', 'tamil': 'Tamil',
    'bengali': 'Bengali', 'telugu': 'Telugu', 'marathi': 'Marathi', 'gujarati': 'Gujarati',
    'urdu': 'Urdu', 'malayalam': 'Malayalam', 'kannada': 'Kannada',
}

def detect_language(persona: str) -> str | None:
    lower = persona.lower()
    for key, lang in LANG_MAP.items():
        if key in lower:
            return lang
    return None


COPY_MANDATE = """COPY QUALITY MANDATE (violations = rejected):
BANNED PHRASES (never use any of these): "Transform your workflow", "Streamline your process", "Boost productivity", "Take it to the next level", "Unlock your potential", "Seamlessly integrate", "All-in-one solution", "Game-changer", "Revolutionary", "Best-in-class", "Cutting-edge", "Next-generation", "Empower your team", "Supercharge your", "Robust solution"
REQUIRED:
- Every headline must reference SPECIFIC content from the site (product name, actual feature, real number)
- Use the site's own terminology from the CONTENT and HEADINGS provided - do not invent generic copy
- Persona angle: CFO = ROI numbers + payback period; Dev = technical precision + code speed; Student = outcome clarity; Consumer = emotion + benefit
- Hero tagline must state WHAT the product does specifically, not vaguely"""


@app.post("/personalize")
async def personalize(req: PersonalizeRequest):
    # Single Playwright session: JS-rendered HTML + 3 scroll screenshots
    rendered_html, screenshots_b64 = await playwright_extract(req.url)

    if rendered_html and len(rendered_html.strip()) > 500:
        html = rendered_html
        text = _extract_text_from_html(rendered_html, req.url)
    else:
        # Playwright failed — fall back to httpx
        text, html = await fetch_text(req.url)

    headings = extract_headings(html)
    domain = urlparse(req.url).netloc.replace('www.', '').split('.')[0].capitalize()
    screenshot_b64 = screenshots_b64[0] if screenshots_b64 else None

    # Extract and download real site images from HTML
    images_meta = extract_images(html)
    if images_meta:
        dl_tasks = [asyncio.create_task(download_image_b64(img["url"])) for img in images_meta]
        dl_results = await asyncio.gather(*dl_tasks, return_exceptions=True)
        for i, res in enumerate(dl_results):
            if isinstance(res, str):
                images_meta[i]["b64"] = res
    available_b64s = [img.get("b64") for img in images_meta if img.get("b64")]

    # Fallback: crop top 42% of Playwright screenshot if no og:image found
    if not available_b64s and screenshots_b64:
        try:
            from PIL import Image
            import io
            img_data = base64.b64decode(screenshots_b64[0])
            img = Image.open(io.BytesIO(img_data)).convert("RGB")
            crop_h = int(img.height * 0.42)
            cropped = img.crop((0, 0, img.width, crop_h))
            buf = io.BytesIO()
            cropped.save(buf, format="JPEG", quality=78, optimize=True)
            available_b64s = [base64.b64encode(buf.getvalue()).decode()]
        except Exception:
            pass

    has_images = len(available_b64s) > 0

    heading_ctx = ""
    if headings:
        heading_ctx = "\nORIGINAL SITE HEADINGS (IA to inform your decisions):\n" + "\n".join(f"  - {h}" for h in headings)

    image_ctx = ""
    if has_images:
        image_ctx = f"\nSITE IMAGES: {len(available_b64s)} image(s) extracted and will be auto-populated into HERO, SHOWCASE, GALLERY module data. Include these modules to show real site imagery."

    model = genai.GenerativeModel(GEMINI_MODEL, system_instruction=SYSTEM)

    lang = detect_language(req.persona)
    lang_ctx = f"\nLANGUAGE MANDATE: Output ALL user-visible text (headlines, descriptions, CTA labels, nav links, footer copy) in {lang}. Keep brand names, product names, and technical terms in their original language." if lang else ""

    prompt = f"""You are making real CRO decisions for morph.ai.

WEBSITE: {req.url} (domain: {domain})
CONTENT (first 3000 chars):
{text[:3000]}
{heading_ctx}
{image_ctx}

PERSONA: {req.persona}{lang_ctx}

{ANTI_STEREOTYPE}

{COPY_MANDATE}

PERSUASION ARC:
- Skeptical: include PROBLEM module before FEATURES
- Price-sensitive: surface PRICING early; stat-driven hero
- Technical: FEATURES before SOCIALPROOF; data over emotion
- Aspirational: cinematic/manifesto hero; HowItWorks before Features
- CTA MUST be the very last module in active_modules array
- The module ORDER IS the persuasion arc

DYNAMIC LOADING STEPS — 5 steps personalized to THIS url+persona combo.
Example for stripe.com + CFO: ["Auditing Stripe's pricing architecture...", "Mapping CFO risk objections...", "Selecting ROI-first layout...", "Calibrating trust signals...", "Rendering your version..."]

{MODULE_MENU}

CRITICAL: In all data objects, every value MUST be a plain string. "secondary_action" must be a plain string like "No credit card required" — NOT an object. For logo-ticker socialproof, attribution = company name only (e.g. "Shopify") NOT "Shopify LOGO".

Return ONLY this JSON:
{{
  "persona_summary": "one sentence",
  "transformation_rationale": "why this layout+theme converts this persona",
  "loading_steps": ["step1", "step2", "step3", "step4", "step5"],
  "nav": {{
    "logo": "brand name max 20 chars",
    "links": ["Nav Link 1", "Nav Link 2", "Nav Link 3", "Nav Link 4"],
    "cta_text": "Primary CTA for nav bar"
  }},
  "footer": {{
    "company": "Full company name",
    "tagline": "One-line brand essence specific to this site",
    "columns": [
      {{"heading": "Column Heading", "links": ["Link 1", "Link 2", "Link 3"]}}
    ],
    "copyright": "\u00a9 2024 Company. All rights reserved."
  }},
  "theme": {{
    "background_mode": "dark|light|high-contrast|editorial-light|deep-black|warm-paper",
    "vibe": "minimalist|bold|corporate|hype|elegant|technical|brutalist|editorial|playful|luxury",
    "primary_color": "indigo|emerald|rose|amber|cyan|violet|orange|slate|red|teal|gold",
    "secondary_color": "different from primary",
    "font_heading": "sans|mono|serif|display|condensed",
    "font_body": "sans|mono|serif",
    "font_size_scale": "compact|normal|large",
    "density": "spacious|balanced|dense",
    "motion": "subtle|expressive|cinematic|none",
    "border_radius": "sharp|soft|rounded",
    "surface_style": "flat|glassy|outlined|elevated"
  }},
  "layout": {{
    "page_width": "narrow|standard|wide|full-bleed",
    "section_rhythm": "uniform|alternating|editorial"
  }},
  "active_modules": [
    {{
      "id": "HERO|PROBLEM|FEATURES|SOCIALPROOF|PRICING|CTA|FAQ|HOWITWORKS|TRUST|TEAM|GALLERY|SHOWCASE|METRICS|BENEFITS",
      "variant": "variant name from menu",
      "layout_hint": "centered|left-aligned|right-aligned|split-left|split-right|asymmetric|full-bleed",
      "accent": "primary|secondary|none",
      "data": {{all values must be plain strings}}
    }}
  ]
}}"""

    try:
        loop = asyncio.get_event_loop()

        # Pass up to 3 scroll-position screenshots for better page context
        if screenshots_b64:
            img_parts = [{"mime_type": "image/jpeg", "data": s} for s in screenshots_b64[:3]]
            contents = [*img_parts, prompt]
        else:
            contents = [prompt]

        resp = await loop.run_in_executor(
            None,
            lambda: model.generate_content(contents, request_options={"timeout": 120})
        )
        raw = resp.text.strip()
        if raw.startswith("```"):
            raw = "\n".join(raw.split("\n")[1:])
        if raw.endswith("```"):
            raw = raw.rsplit("```", 1)[0].strip()
        if raw.startswith("json"):
            raw = raw[4:].strip()

        result = json.loads(raw)

        # Inject downloaded images into eligible modules
        if available_b64s:
            img_idx = 0
            for mod in result.get("active_modules", []):
                if mod.get("id") in ("HERO", "SHOWCASE") and img_idx < len(available_b64s):
                    mod.setdefault("data", {})["image_b64"] = available_b64s[img_idx]
                    img_idx += 1
                elif mod.get("id") == "GALLERY":
                    mod.setdefault("data", {})["images_b64"] = available_b64s[:3]
                    mod["data"]["images_count"] = str(len(available_b64s[:3]))

        result["screenshot_b64"] = screenshot_b64
        return result
    except json.JSONDecodeError:
        raise HTTPException(500, detail=f"Gemini returned invalid JSON: {raw[:500]}")
    except Exception as e:
        raise HTTPException(500, detail=f"Gemini error: {e}")


class CloneRequest(BaseModel):
    url: str
    persona: str = ""
    force: bool = False


@app.get("/clone/cached")
async def clone_cached(url: str):
    """Return cached audit metadata for a URL without running a new audit."""
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    cached = _load_cache(url)
    if cached:
        return {"cached": True, "cached_at": cached.get("cached_at", "")}
    return {"cached": False, "cached_at": ""}


@app.post("/clone")
async def clone(req: CloneRequest):
    """Full CRO audit: full-page screenshot + viewport crops + Gemini Vision analysis."""
    if not req.url.startswith(('http://', 'https://')):
        req.url = 'https://' + req.url

    from playwright.async_api import async_playwright
    from PIL import Image
    import io as _io

    persona_label = req.persona.strip() or "General visitor — evaluate overall CRO quality"

    # ── Check cache ──
    if not req.force:
        cached = _load_cache(req.url)
        if cached:
            return {**cached, "cached_at": cached.get("cached_at", "")}

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={"width": 1440, "height": 900},
                device_scale_factor=2,
            )
            page = await context.new_page()
            try:
                await page.goto(req.url, timeout=30000, wait_until="networkidle")
            except Exception:
                await page.goto(req.url, timeout=30000, wait_until="load")
            await asyncio.sleep(3)

            # Scroll through page using mouse wheel to trigger IntersectionObserver lazy-load
            page_h_est = await page.evaluate("() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)")
            scroll_step = 600
            scroll_steps = max(page_h_est // scroll_step, 1)
            for _ in range(scroll_steps + 1):
                await page.mouse.wheel(0, scroll_step)
                await asyncio.sleep(0.08)
            # Re-measure after lazy content has loaded
            page_h_est = await page.evaluate("() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)")
            await page.evaluate("window.scrollTo(0, 0)")
            await asyncio.sleep(2)

            # Dismiss common cookie / consent overlays
            for sel in [
                'button[id*="accept"]', 'button[class*="accept"]',
                '[class*="cookie"] button', '[class*="consent"] button',
                '[aria-label*="Accept"]', '[aria-label*="accept"]',
                '[data-testid*="accept"]',
            ]:
                try:
                    btn = await page.query_selector(sel)
                    if btn:
                        await btn.click()
                        await asyncio.sleep(0.4)
                        break
                except Exception:
                    pass

            # Full-page screenshot (PNG, 2x scale → high quality)
            png_full = await page.screenshot(full_page=True, type="png")
            page_height = await page.evaluate("() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)")
            viewport_h = 900

            # Take 6 viewport crops evenly spaced across the page
            crop_pngs = []
            num_crops = 6
            for ci in range(num_crops):
                scroll_y = int((page_height - viewport_h) * ci / max(num_crops - 1, 1))
                scroll_y = max(0, min(scroll_y, page_height - viewport_h))
                await page.evaluate(f"window.scrollTo(0, {scroll_y})")
                await asyncio.sleep(0.15)
                vp_png = await page.screenshot(full_page=False, type="png")
                crop_pngs.append((ci, scroll_y, vp_png))

            await browser.close()

        # ── Process full-page for display ──
        img_full = Image.open(_io.BytesIO(png_full)).convert("RGB")
        # Keep at 2x resolution (device_scale_factor=2) for crisp display — only cap at max 2880px wide
        if img_full.width > 2880:
            scale = 2880 / img_full.width
            img_full = img_full.resize((2880, int(img_full.height * scale)), Image.LANCZOS)
        # High quality JPEG for display (95%)
        buf_full = _io.BytesIO()
        img_full.save(buf_full, format="JPEG", quality=97, optimize=True)
        screenshot_b64 = base64.b64encode(buf_full.getvalue()).decode()
        actual_page_h = img_full.height

        # ── Process crops for Gemini ──
        crop_parts = []
        for ci, scroll_y, vp_png in crop_pngs:
            crop_img = Image.open(_io.BytesIO(vp_png)).convert("RGB")
            crop_img = crop_img.resize((crop_img.width // 2, crop_img.height // 2), Image.LANCZOS)
            cbuf = _io.BytesIO()
            crop_img.save(cbuf, format="JPEG", quality=88, optimize=True)
            crop_b64 = base64.b64encode(cbuf.getvalue()).decode()
            y_top = round(scroll_y / max(page_height, 1) * 100)
            y_bot = round(min(scroll_y + viewport_h, page_height) / max(page_height, 1) * 100)
            crop_parts.append({
                "mime_type": "image/jpeg", "data": crop_b64,
                "_meta": {"ci": ci, "y_top": y_top, "y_bot": y_bot},
            })

        # ── Gemini Vision CRO audit ──
        audit_model = genai.GenerativeModel(
            GEMINI_MODEL,
            system_instruction="Return raw JSON only. No markdown fences. No explanation text.",
            generation_config={"temperature": 0.1}
        )

        crop_legend = "\n".join(
            f"  Image {p['_meta']['ci']+1}: page section y={p['_meta']['y_top']}% to y={p['_meta']['y_bot']}%"
            for p in crop_parts
        )

        audit_prompt = f"""You are an elite CRO (conversion rate optimization) expert auditing a live website.

WEBSITE: {req.url}
VISITOR PERSONA: {persona_label}

I am showing you {len(crop_parts)} sequential viewport screenshots of the FULL PAGE, in order from top to bottom:
{crop_legend}

Each image covers the page section at the y% range shown above.

Identify 10-14 specific CRO observations. For each:
- Reference an ACTUAL visible element you see in one of the images
- Set image_num: the image number (1-{len(crop_parts)}) where this element appears
- Set y_in_crop (0-100): vertical position of the element WITHIN that specific image only (0=top of that image, 100=bottom of that image)
- Set x_pct (0-100): left-side elements=15-35, center=40-60, right-side=65-85
- status: "Should Fix" | "Doing Well" | "Nice to Fix"
- headline: max 8 words, reference the actual element
- description: 2-3 sentences — WHY it matters for this persona + specific actionable recommendation

Ensure: ~4 "Should Fix", ~4-5 "Doing Well", ~3 "Nice to Fix". Spread observations across the full page.

Also provide:
- about: 2-3 sentences describing what this website/company does and who their customers are
- scores: exactly 4 CRO category scores (integers 0-100) for: Visual Hierarchy, CTA Clarity, Trust Signals, Copy Clarity

Score each category strictly using these anchors (pick the closest match):
- Visual Hierarchy: 85+ = clear F-pattern with strong size hierarchy; 65-84 = decent but some areas compete for attention; 45-64 = flat/monotone, hard to scan; <45 = confusing, no clear focal points
- CTA Clarity: 85+ = primary CTA is immediately obvious, high contrast, action-oriented text; 65-84 = CTA visible but not dominant; 45-64 = CTA buried or generic text; <45 = CTA missing or invisible
- Trust Signals: 85+ = logos, testimonials, stats, certifications all present above fold; 65-84 = some social proof present; 45-64 = minimal trust signals; <45 = no visible trust signals
- Copy Clarity: 85+ = headline immediately answers "what is this and why should I care?"; 65-84 = clear but somewhat generic; 45-64 = vague, jargon-heavy, or persona-irrelevant; <45 = confusing or meaningless headline

Be strict — a score of 80+ must be genuinely earned. Most real sites score 45-75.

Return ONLY valid JSON (replace integers with your actual assessed scores):
{{
  "about": "2-3 sentence description of the website and its ideal customers.",
  "scores": [
    {{"label": "Visual Hierarchy", "score": 0}},
    {{"label": "CTA Clarity", "score": 0}},
    {{"label": "Trust Signals", "score": 0}},
    {{"label": "Copy Clarity", "score": 0}}
  ],
  "persona_summary": "one sentence: visitor's goal and mindset",
  "annotations": [
    {{
      "n": 1,
      "headline": "Specific headline referencing actual element",
      "description": "2-3 sentences.",
      "status": "Should Fix",
      "image_num": 1,
      "y_in_crop": 50,
      "x_pct": 50
    }}
  ]
}}"""

        loop = asyncio.get_event_loop()
        annotations = []
        persona_summary = persona_label
        try:
            # Build Gemini parts: images only (no _meta in API call)
            gemini_parts = [{"mime_type": p["mime_type"], "data": p["data"]} for p in crop_parts]
            gemini_parts.append(audit_prompt)
            resp = await loop.run_in_executor(
                None,
                lambda: audit_model.generate_content(gemini_parts, request_options={"timeout": 90})
            )
            raw = resp.text.strip()
            if raw.startswith("```"):
                raw = "\n".join(raw.split("\n")[1:])
            if raw.endswith("```"):
                raw = raw.rsplit("```", 1)[0].strip()
            if raw.startswith("json"):
                raw = raw[4:].strip()
            result = json.loads(raw)
            annotations = result.get("annotations", [])
            persona_summary = result.get("persona_summary", persona_label)
            about = result.get("about", "")
            scores = result.get("scores", [])

            # ── Convert image_num + y_in_crop → absolute y_pct ──
            crop_bounds = {p['_meta']['ci']: (p['_meta']['y_top'], p['_meta']['y_bot']) for p in crop_parts}
            for ann in annotations:
                img_num = ann.get('image_num', 1)
                y_in_crop = ann.get('y_in_crop', 50)
                ci = max(0, img_num - 1)
                if ci in crop_bounds:
                    y_top, y_bot = crop_bounds[ci]
                    ann['y_pct'] = round(y_top + (y_in_crop / 100) * (y_bot - y_top), 1)
                else:
                    ann['y_pct'] = y_in_crop
        except Exception:
            annotations = []
            about = ""
            scores = []

        result_data = {
            "screenshot_b64": screenshot_b64,
            "annotations": annotations,
            "persona_summary": persona_summary,
            "about": about,
            "scores": scores,
            "cached_at": "",
        }
        # ── Save to cache ──
        _save_cache(req.url, {**result_data, "cached_at": datetime.now(timezone.utc).isoformat()})
        return result_data

    except Exception as e:
        raise HTTPException(500, detail=f"Audit error: {e}")
