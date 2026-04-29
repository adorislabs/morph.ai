# morph.ai

paste a url. pick a persona. get a full cro audit + ai-redesigned landing page.

## what it does

- scrapes the url with playwright (handles js-rendered pages)
- runs a gemini vision audit with 6 viewport crops → 10-14 annotated cro observations + scores
- generates a full page redesign tailored to the selected visitor persona
- shows old → new morph transition with framer motion

## stack

- **backend**: python 3.10, fastapi, playwright, google-generativeai (gemini-2.5-flash-lite)
- **frontend**: react 18, vite 5, framer motion 11, tailwind css 3, react-router-dom

## setup

**backend**
```bash
cd morph/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

create `morph/backend/.env`:
```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

**frontend**
```bash
cd morph/frontend
npm install
```

## running

```bash
bash start-backend.sh   # http://localhost:8000
bash start-frontend.sh  # http://localhost:5173
```

## url structure

```
/                           → home (url input + persona picker)
/:domain/audit/:hash        → cro audit results
/:domain/redesign/:hash     → ai redesign
```

hash = base64(url + "|" + persona) — both url and persona live in the hash.

## api

| endpoint | method | description |
|---|---|---|
| `/clone` | POST | screenshot + gemini audit → annotations, scores, screenshot_b64 |
| `/personalize` | POST | scrape + gemini redesign → full page schema |
| `/preview` | POST | quick title/excerpt fetch |
| `/clone/cached` | GET | check if audit cache exists for a url |

## personas

developer, luxury consumer, cfo/budget, early adopter, enterprise it, small biz, vc/investor, marketing, student, vp buying committee

each has a fixed browser skeleton layout in the ui (terminal, pricing, sidebar, minimal, luxury, metrics).

## caching

audits are cached to `morph/backend/.audit_cache/` (keyed by url hash). cache is gitignored.
