// GitHubリポジトリ作成用のAPI
export async function POST(request: Request) {
  try {
    const { blogUrl, pageId } = await request.json();
    // GitHubリポジトリの作成処理
    return NextResponse.json({ repositoryUrl: "..." });
  } catch (error) {
    return NextResponse.json({ error: "リポジトリの作成に失敗しました" }, { status: 500 });
  }
} 