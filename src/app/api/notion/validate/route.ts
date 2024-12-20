//https://www.notion.so/Notion-Blog-Sample-14e1dcf229c28018bcbbe57ab6e92e8c?pvs
import { NextResponse } from "next/server";

const NOTION_API_BASE = "https://notion-api.splitbee.io/v1";

export async function POST(request: Request) {
  try {
    const { pageId } = await request.json();

    try {
      const response = await fetch(`${NOTION_API_BASE}/table/${pageId}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        return NextResponse.json({
          valid: false,
          error:
            "このNotionデータベースにアクセスできません。「共有」から「Web公開」を有効にしてください。",
          details: data.error || "アクセス権限がありません",
        });
      }

      if (Array.isArray(data) && data.length === 0) {
        return NextResponse.json({
          valid: false,
          error:
            "Notionデータベースが空か、公開設定がされていません。「共有」から「Web公開」を有効にしてください。",
        });
      }

      return NextResponse.json({ valid: true });
    } catch (error) {
      return NextResponse.json({
        valid: false,
        error:
          "Notionデータベースの公開設定を確認してください。「共有」→「Web公開」を有効にする必要があります。",
        details: error,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Notionデータベースの公開設定を確認してください",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
