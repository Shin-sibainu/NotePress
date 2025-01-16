import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // URLからページIDを抽出
    const pageId = extractPageId(url);
    if (!pageId) {
      return NextResponse.json(
        { error: "無効なNotionのURLです" },
        { status: 400 }
      );
    }

    // Notionページの公開状態を確認
    const isPublic = await checkNotionPagePublic(pageId);

    return NextResponse.json({ 
      isPublic,
      message: isPublic ? "ページは公開されています" : "ページが公開されていません"
    });

  } catch (error) {
    console.error("Check public error:", error);
    return NextResponse.json(
      { error: "ページの公開状態の確認中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

async function checkNotionPagePublic(pageId: string) {
  try {
    const response = await fetch(`https://notion-api.splitbee.io/v1/page/${pageId}`);
    return response.ok;
  } catch {
    return false;
  }
}

function extractPageId(url: string) {
  const matches = url.match(/([a-zA-Z0-9]{32})/);
  return matches ? matches[1] : null;
} 