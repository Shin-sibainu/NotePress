"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { DeploymentProgress } from "./deployment-progress";

export default function BlogStatus() {
  const searchParams = useSearchParams();
  const paymentCompleted = searchParams.get("payment_completed") === "true";
  const blogId = searchParams.get("blog_id");
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    if (paymentCompleted && blogId) {
      // ブログ構築を開始
      const startDeploy = async () => {
        try {
          // ブログ情報を取得
          const blogResponse = await fetch(`/api/blogs/${blogId}`);
          const blog = await blogResponse.json();

          // デプロイを開始
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

          if (!deployResponse.ok) {
            throw new Error(deployData.error || "デプロイに失敗しました");
          }

          // デプロイIDを保存
          localStorage.setItem("deploymentId", deployData.deploymentId);

          toast({
            title: "ブログの構築を開始しました",
            description: "完了までしばらくお待ちください",
          });
        } catch (error) {
          console.error("Deploy error:", error);
          toast({
            variant: "destructive",
            title: "エラー",
            description: "ブログの構築開始に失敗しました",
          });
        }
      };

      startDeploy();
    }
  }, [paymentCompleted, blogId]);

  useEffect(() => {
    const storedDeploymentId = localStorage.getItem("deploymentId");
    if (storedDeploymentId) {
      setDeploymentId(storedDeploymentId);
      setIsDeploying(true);
    }
  }, []);

  if (isDeploying && deploymentId) {
    return <DeploymentProgress deploymentId={deploymentId} />;
  }

  return null;
}
