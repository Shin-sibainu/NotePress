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

export default function BlogStatus() {
  const searchParams = useSearchParams();
  const paymentCompleted = searchParams.get("payment_completed") === "true";
  const blogId = searchParams.get("blog_id");
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentChecked, setDeploymentChecked] = useState(false);
  const [deploymentStatus, setDeploymentStatus] =
    useState<DeploymentStatus | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // 新規デプロイの開始
  useEffect(() => {
    if (paymentCompleted && blogId && !deploymentChecked) {
      const startDeploy = async () => {
        try {
          setIsInitializing(true);
          // 既存のデプロイメント状態をクリア
          setDeploymentStatus(null);
          localStorage.removeItem("deploy_started");
          localStorage.removeItem("deploymentId");

          const blogResponse = await fetch(`/api/blogs/${blogId}`);
          const blog = await blogResponse.json();

          const deployResponse = await fetch("/api/deploy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              blogUrl: blog.url,
              pageId: blog.notionPageId,
              theme: blog.theme,
            }),
          });

          if (!deployResponse.ok) {
            const errorData = await deployResponse.json();
            throw new Error(errorData.error || "デプロイに失敗しました");
          }

          const deployData = await deployResponse.json();

          // デプロイ情報を設定
          localStorage.setItem("deploymentId", deployData.deploymentId);
          // 即座に状態を更新
          setDeploymentId(deployData.deploymentId);
          setIsDeploying(true);

          // トースト通知は状態更新後に表示
          toast({
            title: "ブログの構築を開始します",
            description: "完了までしばらくお待ちください",
          });
        } catch (error) {
          console.error("Deploy error:", error);
          setIsInitializing(false);
          toast({
            variant: "destructive",
            title: "エラー",
            description:
              error instanceof Error
                ? error.message
                : "ブログの構築開始に失敗しました",
          });
        }
      };

      startDeploy();
      setDeploymentChecked(true);
    }
  }, [paymentCompleted, blogId, deploymentChecked, toast]);

  // deploymentIdの変更を監視して初期化状態を解除
  useEffect(() => {
    if (deploymentId) {
      setIsInitializing(false);
    }
  }, [deploymentId]);

  // 既存のデプロイメントの状態確認
  useEffect(() => {
    const storedDeploymentId = localStorage.getItem("deploymentId");

    // ブログURLを取得
    const storedBlogUrl = localStorage.getItem("blogUrl");

    if (storedBlogUrl) {
      // デプロイ完了済みの場合
      const isDeploymentCompleted =
        localStorage.getItem(`deployment_${storedDeploymentId}_completed`) ===
        "true";

      if (isDeploymentCompleted || !storedDeploymentId) {
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
      // デプロイメント状態を確認
      fetch(`/api/deploy/status?deploymentId=${storedDeploymentId}`)
        .then((res) => res.json())
        .then((data) => {
          setDeploymentStatus(data);

          // 完了またはエラーの場合はプログレスバーを表示しない
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
        .catch((error) => {
          console.error("Error fetching deployment status:", error);
        });
    }
  }, [deploymentId]);

  // ここ出てくるのが、遅い。
  if (deploymentId) {
    return <DeploymentProgress deploymentId={deploymentId} />;
  }

  if (isInitializing && paymentCompleted) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xl font-medium">
              ブログを準備しています...
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            10~20秒程度お待ちください
          </p>
        </div>
      </div>
    );
  }

  // 既存のデプロイメント状態は、有料テンプレート購入時以外でのみ表示
  if (deploymentStatus && !isInitializing && !paymentCompleted) {
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
