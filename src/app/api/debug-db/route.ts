import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const personas = await prisma.voicePersona.findMany();
    const canhQuays = await prisma.canhQuay.findMany();
    return NextResponse.json({ personas, canhQuays });
}
