"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, XCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DeploymentProgressProps {
  deploymentId: string;
}

type DeployPhase = "QUEUED" | "BUILDING" | "DEPLOYING" | "READY" | "ERROR";

interface DeploymentStatus {
  phase: DeployPhase;
  message: string;
  progress: number;
}

interface BuildStep {
  label: string;
  progress: number;
}

export function DeploymentProgress({ deploymentId }: DeploymentProgressProps) {
  const [status, setStatus] = useState<DeploymentStatus>({
    phase: "QUEUED",
    message: "デプロイの準備中...",
    progress: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [blogUrl, setBlogUrl] = useState<string | null>(null);
  const [buildStartTime] = useState(Date.now());

  const buildSteps: BuildStep[] = [
    { label: "依存関係のインストール", progress: 10 },
    { label: "ソースコードのコンパイル", progress: 25 },
    { label: "静的ファイルの生成", progress: 40 },
    { label: "最適化", progress: 55 },
    { label: "デプロイの準備", progress: 70 },
    { label: "サイトの公開", progress: 85 },
    { label: "DNS設定の反映", progress: 100 },
  ];

  const [currentBuildStep, setCurrentBuildStep] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(
          `/api/deploy/status?deploymentId=${deploymentId}`
        );
        const data = await response.json();

        let message = "デプロイの準備中...";
        let progress = 0;

        switch (data.phase) {
          case "QUEUED":
            message = "デプロイの準備中...";
            progress = 10;
            break;
          case "BUILDING":
            const buildProgress = Math.min(
              40 + Math.floor((Date.now() - buildStartTime) / 1000) * 2,
              70
            );
            message = "ブログをビルド中...";
            progress = buildProgress;
            break;
          case "DEPLOYING":
            message = "ブログを公開中...";
            progress = 85;
            break;
          case "READY":
            const storedBlogUrl = localStorage.getItem("blogUrl");
            const fullUrl = `https://${storedBlogUrl}.notepress.xyz`;
            setBlogUrl(fullUrl);
            setIsCompleted(true);
            progress = 100;
            break;
          case "ERROR":
            message = "エラーが発生しました";
            break;
        }

        setStatus({
          phase: data.phase,
          message,
          progress: Math.max(status.progress, progress),
        });

        if (data.phase !== "READY" && data.phase !== "ERROR") {
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        console.error("Failed to check deployment status:", error);
        setStatus({
          phase: "ERROR",
          message: "エラーが発生しました",
          progress: status.progress,
        });
      }
    };

    checkStatus();
  }, [deploymentId, status.progress, buildStartTime]);

  useEffect(() => {
    if (status.phase === "BUILDING") {
      const interval = setInterval(() => {
        setCurrentBuildStep((prev) => {
          if (prev < buildSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 8000); // 8秒ごとに次のステップへ

      return () => clearInterval(interval);
    }
  }, [buildSteps.length, status.phase]);

  if (isCompleted && blogUrl) {
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
            <Link href={blogUrl} target="_blank">
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{status.message}</h3>
          <span className="text-sm text-muted-foreground">
            {status.progress}%
          </span>
        </div>
        <Progress value={status.progress} className="h-2" />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {status.phase === "BUILDING" && (
          <div className="space-y-2 w-full">
            {buildSteps.map((step, index) => (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-2 text-sm transition-opacity duration-300",
                  index > currentBuildStep && "opacity-40"
                )}
              >
                {index <= currentBuildStep ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span>{step.label}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-4">
              ※ ビルドには数分かかる場合があります
            </p>
          </div>
        )}
        {status.phase !== "BUILDING" && (
          <>
            {status.phase === "QUEUED" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {status.phase === "DEPLOYING" && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            {status.phase === "READY" && (
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            )}
            {status.phase === "ERROR" && (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <span>{status.message}</span>
          </>
        )}
      </div>
    </div>
  );
}
