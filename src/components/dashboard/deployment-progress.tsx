"use client";

import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { Loader2, Circle, CheckCircle, XCircle } from "lucide-react";

interface DeploymentProgressProps {
  deploymentId: string;
  onComplete: (url: string) => void;
}

type DeployStep = {
  id: string;
  label: string;
  status: "pending" | "loading" | "complete" | "error";
};

export function DeploymentProgress({ deploymentId, onComplete }: DeploymentProgressProps) {
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 60;
  const [deployStatus, setDeployStatus] = useState<DeployStep[]>([
    { id: "INIT", label: "初期化", status: "pending" },
    { id: "GITHUB", label: "リポジトリ作成", status: "pending" },
    { id: "VERCEL", label: "プロジェクト設定", status: "pending" },
    { id: "BUILD", label: "ビルド", status: "pending" },
    { id: "DEPLOY", label: "デプロイ", status: "pending" },
  ]);

  const updateDeployStatus = (
    stepId: string,
    status: "pending" | "loading" | "complete" | "error"
  ) => {
    setDeployStatus((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  useEffect(() => {
    const checkDeployment = async () => {
      if (attempts >= maxAttempts) {
        updateDeployStatus("DEPLOY", "error");
        return;
      }

      try {
        const response = await fetch(`/api/deploy/status?deploymentId=${deploymentId}`);
        const data = await response.json();

        // フェーズに基づいてステータスを更新
        if (data.phase === "QUEUED") {
          updateDeployStatus("VERCEL", "loading");
        } else if (data.phase === "BUILDING") {
          updateDeployStatus("VERCEL", "complete");
          updateDeployStatus("BUILD", "loading");
        } else if (data.phase === "DEPLOYING") {
          updateDeployStatus("BUILD", "complete");
          updateDeployStatus("DEPLOY", "loading");
        } else if (data.status === "READY") {
          updateDeployStatus("DEPLOY", "complete");
          // デプロイ完了
          onComplete(data.url);
          return;
        }

        setAttempts((prev) => prev + 1);
        setTimeout(checkDeployment, 3000);
      } catch (error) {
        console.error("Failed to check deployment status:", error);
        updateDeployStatus("DEPLOY", "error");
      }
    };

    checkDeployment();
  }, [deploymentId, attempts, maxAttempts, onComplete]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ブログを構築中...</h1>
      <div className="space-y-4">
        {deployStatus.map((step, index) => (
          <div key={step.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                {step.status === "pending" && (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                {step.status === "loading" && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                {step.status === "complete" && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {step.status === "error" && (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                {step.label}
              </span>
              {step.status === "loading" && (
                <span className="text-xs text-muted-foreground">
                  {step.label}中...
                </span>
              )}
            </div>
            {index < deployStatus.length - 1 && (
              <Progress
                value={step.status === "complete" ? 100 : 0}
                className="h-1"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 