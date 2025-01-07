import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

    if (eventType === "user.created") {
      try {
        const { id } = evt.data;
        await prisma.user.create({
          data: {
            clerkId: id,
          },
        });
        return new Response("User created successfully", { status: 201 });
      } catch (error) {
        console.error("Database error:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    // ユーザー削除イベントの処理を追加
    if (eventType === "user.deleted") {
      try {
        const { id } = evt.data;
        // まずユーザーが存在するか確認
        const user = await prisma.user.findUnique({
          where: {
            clerkId: id,
          },
        });

        // ユーザーが存在する場合のみ削除処理を実行
        if (user) {
          // ユーザーに関連するブログを削除
          await prisma.blog.deleteMany({
            where: {
              user: {
                clerkId: id,
              },
            },
          });
          // ユーザーを削除
          await prisma.user.delete({
            where: {
              clerkId: id,
            },
          });
          return new Response("User deleted successfully", { status: 200 });
        }

        // ユーザーが存在しない場合は正常終了として扱う
        return new Response("User not found", { status: 200 });
      } catch (error) {
        console.error("Database error:", error);
        return new Response("Error deleting user", { status: 500 });
      }
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
