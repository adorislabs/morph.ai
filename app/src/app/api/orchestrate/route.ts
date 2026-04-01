import { NextRequest, NextResponse } from "next/server";
import { generateMutationBlueprint } from "@/lib/orchestrator";
import { extractSignals } from "@/lib/signals";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams, kineticState } = body;

    const signals = extractSignals(searchParams || {}, {
      referer: request.headers.get("referer") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    // Override with client-provided signals
    if (body.signals) {
      Object.assign(signals, body.signals);
    }

    const startTime = Date.now();
    const blueprint = await generateMutationBlueprint(signals, kineticState);
    const latency = Date.now() - startTime;

    return NextResponse.json({
      blueprint,
      signals,
      meta: {
        latency_ms: latency,
        model: "gemini-2.5-flash",
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Orchestrator API error:", error);
    return NextResponse.json(
      { error: "Orchestrator failed" },
      { status: 500 }
    );
  }
}
