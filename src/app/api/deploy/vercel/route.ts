// Vercelプロジェクト作成用のAPI
export async function POST(request: Request) {
  try {
    const { repositoryUrl } = await request.json();
    // Vercelプロジェクトの作成処理
    return NextResponse.json({ projectId: "...", deploymentId: "..." });
  } catch (error) {
    return NextResponse.json({ error: "プロジェクトの作成に失敗しました" }, { status: 500 });
  }
} 