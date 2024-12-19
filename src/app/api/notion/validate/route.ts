//https://www.notion.so/Notion-Blog-Sample-14e1dcf229c28018bcbbe57ab6e92e8c?pvs
import { NextResponse } from "next/server";

const NOTION_API_BASE = "https://notion-api.splitbee.io/v1";

export async function POST(request: Request) {
  try {
    const { pageId } = await request.json();

    try {
      // notion-api-workerを使用してページの存在確認
      const response = await fetch(`${NOTION_API_BASE}/table/${pageId}`, {
        next: { revalidate: 0 },
      });

      const data = await response.json();


      // エラーチェックを追加
      if (!response.ok || data.error) {
        return NextResponse.json({
          valid: false,
          error: "無効なNotionページIDです。データベースのページIDを正しく入力してください。",
          details: data.error || "ページが見つかりません"
        });
      }

      // データが空配列の場合もエラー
      if (Array.isArray(data) && data.length === 0) {
        return NextResponse.json({
          valid: false,
          error: "このNotionデータベースは空か、アクセスできません。データベースに記事が存在することを確認してください。",
        });
      }

      return NextResponse.json({ valid: true });
    } catch (error) {
      console.error("Validation Error:", error);
      return NextResponse.json({
        valid: false,
        error: error instanceof Error ? error.message : "指定されたページIDは無効です",
        details: error
      });
    }
  } catch (error) {
    console.error("Request Error:", error);
    return NextResponse.json(
      { 
        error: "バリデーションに失敗しました",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
