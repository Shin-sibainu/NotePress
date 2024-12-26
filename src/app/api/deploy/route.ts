import { NextResponse } from "next/server";

interface DeploymentConfig {
  blogUrl: string;
  pageId: string;
  theme: string;
}

const VERCEL_TOKEN = process.env.VERCEL_ACCESS_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_TOKEN;

export async function POST(request: Request) {
  if (!VERCEL_TOKEN || !GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "必要な環境変数が設定されていません" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { blogUrl, pageId, theme } = body as DeploymentConfig;

    // テンプレートリポジトリへのアクセスを確認
    const templateCheck = await fetch(
      "https://api.github.com/repos/Shin-sibainu/minimalist",
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!templateCheck.ok) {
      throw new Error("テンプレートリポジトリへのアクセス権限がありません");
    }

    // 1. リポジトリを作成
    const githubResponse = await fetch(
      `https://api.github.com/repos/Shin-sibainu/${theme}/generate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          name: `blog-${blogUrl}`,
          description: `Blog created with NotionCMS for ${blogUrl}`,
          private: true,
          include_all_branches: true,
        }),
      }
    );

    if (!githubResponse.ok) {
      const error = await githubResponse.json();

      // リポジトリ名の重複エラーをチェック
      if (
        error.message ===
          "Could not clone: Name already exists on this account" ||
        error.errors?.includes(
          "Could not clone: Name already exists on this account"
        )
      ) {
        return NextResponse.json(
          {
            error: `ドメイン「${blogUrl}」は既に使用されています。別のドメイン名を試してください。`,
            code: "DOMAIN_EXISTS",
          },
          { status: 409 }
        );
      }

      // その他のエラー
      return NextResponse.json(
        {
          error:
            "予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください。",
          code: "UNKNOWN_ERROR",
        },
        { status: 500 }
      );
    }

    // const repoData = await githubResponse.json();

    // 2. Vercelプロジェクトを作成
    const vercelResponse = await fetch("https://api.vercel.com/v9/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: blogUrl,
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: `Shin-sibainu/blog-${blogUrl}`,
          productionBranch: "master",
        },
      }),
    });

    const responseData = await vercelResponse.json();

    if (!vercelResponse.ok) {
      console.error("Vercel Project Creation Error:", {
        status: vercelResponse.status,
        statusText: vercelResponse.statusText,
        error: responseData,
      });
      throw new Error(
        `Vercelプロジェクトの作成に失敗しました (${
          vercelResponse.status
        }): ${JSON.stringify(responseData)}`
      );
    }

    const project = responseData;

    // 3. 環境変数を設定
    const envVariables = [
      {
        key: "NOTION_PAGE_ID",
        value: pageId,
        type: "encrypted",
        target: ["production", "preview"],
      },
      {
        key: "NEXT_PUBLIC_BASE_URL",
        value: `https://${blogUrl}.notepress.xyz`,
        type: "plain",
        target: ["production", "preview"],
      },
    ];

    // 環境変数を1つずつ設定
    for (const env of envVariables) {
      await fetch(
        `https://api.vercel.com/v10/projects/${project.id}/env?upsert=true`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${VERCEL_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(env),
        }
      );
    }

    // 3.5 カスタムドメインを設定（必要）
    await fetch(`https://api.vercel.com/v9/projects/${project.id}/domains`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${blogUrl}.notepress.xyz`,
      }),
    });

    // 4. デプロイメントをトリガー
    const deploymentResponse = await fetch(
      "https://api.vercel.com/v13/deployments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: blogUrl,
          project: project.id,
          gitSource: {
            type: "github",
            ref: "master",
            repoId: project.link.repoId,
          },
          target: "production",
          alias: [`${blogUrl}.notepress.xyz`],
        }),
      }
    );

    const deploymentData = await deploymentResponse.json();

    if (!deploymentResponse.ok) {
      throw new Error(
        `デプロイメントの開始に失敗しました: ${JSON.stringify(deploymentData)}`
      );
    }

    // Vercelが生成した実際のURLを使用
    const deploymentUrl = deploymentData.url;

    return NextResponse.json({
      success: true,
      url: deploymentUrl,
      deploymentId: deploymentData.id,
      projectId: project.id,
    });
  } catch (error) {
    console.error("Deployment failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "デプロイメントに失敗しました",
      },
      { status: 500 }
    );
  }
}
