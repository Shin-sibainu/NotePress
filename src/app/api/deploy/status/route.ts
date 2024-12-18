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
    const response = await fetch(
      `https://api.vercel.com/v9/deployments/${deploymentId}`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("デプロイメント状態の取得に失敗しました");
    }

    const data = await response.json();
    console.log("Deployment Status Response:", {
      deploymentId,
      readyState: data.readyState,
      url: data.url,
      phase: data.phase,
      raw: data,
    });

    const deploymentUrl = data.alias?.[0] || 
      (data.url ? `https://${data.url.split('-')[0]}.vercel.app` : null);

    return NextResponse.json({
      status: data.readyState,
      url: deploymentUrl,
      phase: data.phase || null,
    });
  } catch (error) {
    console.error("Failed to check deployment status:", error);
    return NextResponse.json(
      { error: "デプロイメント状態の確認に失敗しました" },
      { status: 500 }
    );
  }
}
