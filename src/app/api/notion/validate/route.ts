//https://www.notion.so/Notion-Blog-Sample-14e1dcf229c28018bcbbe57ab6e92e8c?pvs
import { NextResponse } from "next/server";

const NOTION_API_BASE = "https://notion-api.splitbee.io/v1";

export async function POST(request: Request) {
  try {
    const { pageId } = await request.json();

    // URLからIDを抽出する関数
    const extractNotionId = (input: string) => {
      // 最後の32文字のIDを探す
      const matches = input.match(/[a-zA-Z0-9]{32}/);
      if (matches) {
        const id = matches[0];
        // 8-4-4-4-12の形式に変換
        return [
          id.slice(0, 8),
          id.slice(8, 12),
          id.slice(12, 16),
          id.slice(16, 20),
          id.slice(20),
        ].join("-");
      }
      return null;
    };

    const formattedId = extractNotionId(pageId);

    if (!formattedId) {
      return NextResponse.json({
        valid: false,
        error: "無効なNotionデータベースIDです",
      });
    }

    const apiUrl = `${NOTION_API_BASE}/table/${formattedId}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("API Error:", data.error);
      return NextResponse.json({
        valid: false,
        error:
          "このNotionデータベースにアクセスできません。「共有」から「Web公開」を有効にしてください。",
        details: data.error || "アクセス権限がありません",
      });
    }

    if (Array.isArray(data) && data.length === 0) {
      console.log("Empty database response");
      return NextResponse.json({
        valid: false,
        error:
          "Notionデータベースが空か、公開設定がされていません。「共有」から「Web公開」を有効にしてください。",
      });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      {
        error: "Notionデータベースの公開設定を確認してください",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
