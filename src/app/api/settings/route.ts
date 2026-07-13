import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    let settings = await prisma.userSetting.findUnique({
      where: { userId: user.id },
    });

    if (!settings) {
      settings = await prisma.userSetting.create({
        data: { userId: user.id },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const body = await request.json();
    const { modelName, language, theme, artStyle, ttsVoice, ttsEnabled } = body;

    const settings = await prisma.userSetting.upsert({
      where: { userId: user.id },
      update: {
        modelName,
        language,
        theme,
        artStyle,
        ttsVoice,
        ttsEnabled,
      },
      create: {
        userId: user.id,
        modelName: modelName || "llama3.2",
        language: language || "ar",
        theme: theme || "dark",
        artStyle: artStyle || "pixar",
        ttsVoice,
        ttsEnabled: ttsEnabled || false,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
