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

    // プロジェクト情報を取得
    const projectResponse = await fetch(
      `https://api.vercel.com/v13/projects/${statusData.projectId}`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );
    const projectData = await projectResponse.json();

    // 最終的なプロジェクトURL
    const finalUrl = `${projectData.name}.notepress.xyz`;

    // ビルドの進行状況を計算
    let buildProgress = 0;
    const startTime = statusData.buildingAt
      ? new Date(statusData.buildingAt).getTime()
      : Date.now();
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const expectedBuildTime = 60000; // 予想ビルド時間: 60秒

    // 基本進捗を計算
    const baseProgress = (() => {
      switch (statusData.readyState) {
        case "QUEUED":
          return 10;
        case "INITIALIZING":
          return 30;
        case "BUILDING":
          return 50;
        case "READY":
          return 100;
        default:
          return 0;
      }
    })();

    // 経過時間に基づく追加進捗を計算
    const timeProgress = (elapsedTime / expectedBuildTime) * 30;
    buildProgress = Math.min(
      baseProgress + timeProgress,
      statusData.readyState === "READY" ? 100 : baseProgress + 30
    );

    // 最小進捗を保証（後退を防ぐ）
    buildProgress = Math.max(buildProgress, baseProgress);

    if (statusData.readyState === "ERROR") {
      return NextResponse.json({
        status: "ERROR",
        url: finalUrl,
        phase: "ERROR",
        buildProgress: baseProgress,
        elapsedTime,
        errorDetail: statusData.errorCode || statusData.errorMessage,
      });
    }

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
