/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blog = await prisma.blog.findFirstOrThrow({
      where: {
        id: params.id,
        user: {
          clerkId: userId,
        },
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Blog not found" },
      { status: 404 }
    );
  }
} 