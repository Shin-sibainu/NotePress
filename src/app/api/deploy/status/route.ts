import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deploymentId = searchParams.get("deploymentId");
  const VERCEL_TOKEN = process.env.VERCEL_ACCESS_TOKEN;

  if (!deploymentId) {
    return NextResponse.json(
      { error: "deploymentIdが必要です" },
      { status: 400 }
    );
  }

  try {
    // デプロイメント情報を取得
    const statusResponse = await fetch(
      `https://api.vercel.com/v13/deployments/${deploymentId}`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );

    const statusData = await statusResponse.json();
    const elapsedTime = Date.now() - new Date(statusData.created).getTime();

    // 状態に基づいて進捗を計算
    let buildProgress = 0;
    const state = statusData.readyState;

    switch (state) {
      case "QUEUED":
        buildProgress = Math.min(
          30,
          10 + Math.floor((elapsedTime / 10000) * 20)
        ); // 10秒で30%まで
        break;
      case "BUILDING":
        // より速く進捗を進める
        buildProgress = Math.min(
          80,
          30 + Math.floor((elapsedTime / 20000) * 50) // 20秒で80%まで
        );
        break;
      case "DEPLOYING":
        // デプロイ中は80-95%
        buildProgress = Math.min(
          95,
          80 + Math.floor((elapsedTime / 10000) * 15) // 10秒で95%まで
        );
        break;
      case "READY":
        buildProgress = 100;
        break;
      case "ERROR":
        // エラー時は現在の進捗を維持
        buildProgress = Math.max(30, Math.floor((elapsedTime / 20000) * 50));
        break;
      default:
        // 不明な状態の場合は経過時間に基づいて進捗を計算
        buildProgress = Math.min(95, Math.floor((elapsedTime / 30000) * 95));
    }

    // プロジェクト情報を取得してURLを構築
    const projectResponse = await fetch(
      `https://api.vercel.com/v13/projects/${statusData.projectId}`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );
    const projectData = await projectResponse.json();
    const finalUrl = `${projectData.name}.notepress.xyz`;

    return NextResponse.json({
      status: statusData.readyState,
      url: finalUrl,
      phase: statusData.readyState,
      buildProgress: Math.round(buildProgress),
      state: statusData.state,
      elapsedTime: elapsedTime,
    });
  } catch (error) {
    console.error("Failed to check deployment status:", error);
    return NextResponse.json(
      { error: "デプロイメント状態の確認に失敗しました" },
      { status: 500 }
    );
  }
}
