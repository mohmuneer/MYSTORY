import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const stories = await prisma.story.findMany({
      where: { userId: user.id },
      include: { _count: { select: { scenes: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ stories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    const story = await prisma.story.create({
      data: {
        userId,
        title: "قصة جديدة",
        prompt: "",
        storyText: "",
      },
    });
    return NextResponse.json({ story });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
