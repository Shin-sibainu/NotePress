import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
      throw new Error(
        "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
      );
    }

    // Get headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing svix headers");
      return new Response("Error: Missing Svix headers", { status: 400 });
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Error: Verification failed", { status: 400 });
    }

    // Handle the webhook event
    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      try {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;
        const fullName = [first_name, last_name].filter(Boolean).join(" ");

        await prisma.user.upsert({
          where: { clerkId: id },
          update: {
            name: fullName || undefined,
            email: primaryEmail || undefined,
          },
          create: {
            clerkId: id,
            name: fullName || undefined,
            email: primaryEmail || undefined,
          },
        });

        return new Response("User data synced successfully", { status: 200 });
      } catch (error) {
        console.error("Database error:", error);
        return new Response("Error syncing user data", { status: 500 });
      }
    }

    // ユーザー削除イベントの処理を追加
    if (eventType === "user.deleted") {
      try {
        const { id } = evt.data;

        // トランザクションを使用して、関連するレコードを順番に削除
        await prisma.$transaction(async (tx) => {
          // まず購入履歴を削除
          await tx.purchase.deleteMany({
            where: {
              user: {
                clerkId: id,
              },
            },
          });

          // 次にブログを削除
          await tx.blog.deleteMany({
            where: {
              user: {
                clerkId: id,
              },
            },
          });

          // 最後にユーザーを削除
          await tx.user.delete({
            where: {
              clerkId: id,
            },
          });
        });

        return NextResponse.json(
          { message: "User deleted successfully" },
          { status: 200 }
        );
      } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Error deleting user" },
          { status: 500 }
        );
      }
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
