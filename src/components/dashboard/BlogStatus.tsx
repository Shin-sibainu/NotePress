/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { DeploymentProgress } from "./deployment-progress";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

interface DeploymentStatus {
  status: string;
  url: string;
  buildProgress: number;
}

// ステップの型定義を追加
type DeployStep = "INIT" | "FETCHING_BLOG" | "DEPLOYING" | "COMPLETE";

export default function BlogStatus() {
  const searchParams = useSearchParams();
  const paymentCompleted = searchParams.get("payment_completed") === "true";
  const blogId = searchParams.get("blog_id");

  // 決済完了フラグを追加（コンポーネントのマウント時点から有効）
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentChecked, setDeploymentChecked] = useState(false);
  const [deploymentStatus, setDeploymentStatus] =
    useState<DeploymentStatus | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [currentStep, setCurrentStep] = useState<DeployStep>("INIT");

  // 最初に実行される - 決済完了状態をチェック
  useEffect(() => {
    if (paymentCompleted && blogId) {
      // 決済完了フラグを即座に設定
      setIsPaymentComplete(true);
      // 既存の情報をクリア
      setDeploymentStatus(null);
      // 初期化状態を設定
      setIsInitializing(true);
      setCurrentStep("INIT");
    }
  }, []);

  // ローディング表示のコンポーネント
  const LoadingDisplay = () => {
    const messages = {
      INIT: {
        title: "準備しています...",
        description: "ブログの構築準備を開始します",
      },
      FETCHING_BLOG: {
        title: "ブログ情報を取得中...",
        description: "Notionからブログ情報を取得しています",
      },
      DEPLOYING: {
        title: "ブログを構築中...",
        description: "完了まで10~20秒程度お待ちください",
      },
      COMPLETE: {
        title: "構築完了",
        description: "ブログの構築が完了しました",
      },
    };

    const currentMessage = messages[currentStep];

    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-2xl font-medium">{currentMessage.title}</span>
            <p className="text-sm text-muted-foreground">
              {currentMessage.description}
            </p>
          </div>

          {/* ステップインジケーター */}
          <div className="flex gap-2 items-center mt-8">
            {Object.keys(messages).map((step, index) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full ${
                  Object.keys(messages).indexOf(currentStep) >= index
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 新規デプロイの開始
  useEffect(() => {
    if (
      (paymentCompleted || isPaymentComplete) &&
      blogId &&
      !deploymentChecked
    ) {
      const startDeploy = async () => {
        try {
          // 初期化中の状態を設定
          setIsInitializing(true);
          setCurrentStep("FETCHING_BLOG");

          const blogResponse = await fetch(`/api/blogs/${blogId}`);
          const blog = await blogResponse.json();

          // 新しいブログURLをローカルストレージに保存
          localStorage.setItem("blogUrl", blog.url);

          setCurrentStep("DEPLOYING");
          localStorage.setItem("deploy_started", "true");

          const deployResponse = await fetch("/api/deploy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              blogUrl: blog.url,
              pageId: blog.notionPageId,
              theme: blog.theme,
            }),
          });

          const deployData = await deployResponse.json();

          // デプロイIDが返ってきた場合は使用
          if (deployData.deploymentId) {
            localStorage.setItem("deploymentId", deployData.deploymentId);
            setDeploymentId(deployData.deploymentId);
            setIsDeploying(true);
          }
          // エラー応答でもデプロイIDがあれば利用（重複ドメインエラー等）
          else if (!deployResponse.ok && deployData.existingDeploymentId) {
            localStorage.setItem(
              "deploymentId",
              deployData.existingDeploymentId
            );
            setDeploymentId(deployData.existingDeploymentId);
            setIsDeploying(true);
          }
          // 本当のエラーの場合
          else if (!deployResponse.ok) {
            throw new Error(deployData.error || "デプロイに失敗しました");
          }

          // 常に7秒間はローディング表示を維持
          setTimeout(() => {
            setIsInitializing(false);
          }, 7000);
        } catch (error) {
          console.error("Deploy error:", error);

          // エラーでも7秒間はローディング表示を維持
          setTimeout(() => {
            localStorage.removeItem("deploy_started");
            setIsInitializing(false);
          }, 7000);
        }
      };

      startDeploy();
      setDeploymentChecked(true);
    }
  }, [paymentCompleted, isPaymentComplete, blogId, deploymentChecked]);

  // 既存のデプロイメント状態確認
  useEffect(() => {
    // 決済完了時は既存の状態確認をスキップ
    if (paymentCompleted || isPaymentComplete) {
      return;
    }

    const storedDeploymentId = localStorage.getItem("deploymentId");
    const storedBlogUrl = localStorage.getItem("blogUrl");

    if (storedBlogUrl) {
      const isDeploymentCompleted =
        localStorage.getItem(`deployment_${storedDeploymentId}_completed`) ===
        "true";
      if (isDeploymentCompleted || !storedDeploymentId) {
        // 最新のURLで状態を更新
        setDeploymentStatus({
          status: "READY",
          url: `${storedBlogUrl}.notepress.xyz`,
          buildProgress: 100,
        });
        setIsDeploying(false);
        return;
      }
    }

    if (storedDeploymentId) {
      fetch(`/api/deploy/status?deploymentId=${storedDeploymentId}`)
        .then((res) => res.json())
        .then((data) => {
          setDeploymentStatus(data);
          if (data.status === "READY") {
            localStorage.setItem(
              `deployment_${storedDeploymentId}_completed`,
              "true"
            );
            setIsDeploying(false);
          } else if (data.status === "ERROR") {
            setIsDeploying(false);
          } else if (!deploymentId) {
            setDeploymentId(storedDeploymentId);
            setIsDeploying(true);
          }
        })
        .catch(console.error);
    }
  }, [deploymentId, paymentCompleted, isPaymentComplete]);

  // 表示の条件分岐
  if (isInitializing && (paymentCompleted || isPaymentComplete)) {
    return <LoadingDisplay />;
  }

  if (deploymentId) {
    return <DeploymentProgress deploymentId={deploymentId} />;
  }

  // 決済完了時は他の表示をしない
  if (paymentCompleted || isPaymentComplete) {
    return null;
  }

  // 既存のデプロイメント状態は、有料テンプレート購入時以外でのみ表示
  if (deploymentStatus) {
    // URLの形式を確認
    const blogUrl = deploymentStatus.url || "";
    const fullUrl = blogUrl.includes("http") ? blogUrl : `https://${blogUrl}`;

    return (
      <>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">ブログステータス</h2>
            <p className="text-muted-foreground mb-4">
              あなたのブログは正常に公開されています
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(blogUrl);
                toast({
                  title: "コピーしました",
                  description: "URLをクリップボードにコピーしました",
                });
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              URLをコピー
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-accent/50 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">{blogUrl}</span>
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
            asChild
          >
            <Link href={fullUrl} target="_blank">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                オンライン
                <ExternalLink className="h-3 w-3" />
              </span>
            </Link>
          </Button>
        </div>
      </>
    );
  }

  return null;
}

/* 
memo(決済後の挙動)
1. 決済が完了する
2. ダッシュボードページに移動して、BlogStatusも以前の情報も何も表示されない。
3. 以前の情報のリンクとステータス状態が3秒くらい映る。
4. そこからDeploymentProgressがはじまる。(LoadingDisplayが一度も表示されていない。)

*/
