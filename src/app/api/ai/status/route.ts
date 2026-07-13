import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        connected: true,
        models: data.models || [],
      });
    }

    return NextResponse.json({ connected: false, models: [] });
  } catch {
    return NextResponse.json({ connected: false, models: [] });
  }
}
