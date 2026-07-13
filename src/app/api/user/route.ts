import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      include: { interests: true, settings: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, gender } = body;

    const existing = await prisma.user.findFirst();
    if (existing) {
      return NextResponse.json({ user: existing });
    }

    const user = await prisma.user.create({
      data: {
        name,
        age,
        gender,
        settings: {
          create: {},
        },
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
