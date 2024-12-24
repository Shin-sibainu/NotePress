//14e1dcf229c28018bcbbe57ab6e92e8c
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  ArrowRight,
  Loader2,
  Rocket,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BasicInfoStep } from "./BasicInfoStep";
import ThemeSelectionStep from "./ThemeSelectionStep";
import NotionSetupStep from "./NotionSetupStep";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { DeployStep, DeployStepStatus } from "@/types/deploy";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SetupData {
  basicInfo: { url: string | null } | null;
  notionConnection: { pageId: string | null } | null;
  selectedTheme: string | null;
}

const INITIAL_STEPS: DeployStep[] = [
  {
    id: "INIT",
    label: "初期化",
    status: "pending",
    description: "プロジェクトの初期設定を行っています",
  },
  {
    id: "GITHUB",
    label: "リポジトリ作成",
    status: "pending",
    description: "GitHubリポジトリを作成しています",
  },
  {
    id: "BUILD",
    label: "ビルド",
    status: "pending",
    description: "アプリケーションをビルドしています",
  },
  {
    id: "DEPLOY",
    label: "デプロイ",
    status: "pending",
    description: "Webサイトをデプロイしています",
  },
];

export function SetupStepper() {
  const { toast } = useToast();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [setupData, setSetupData] = useState<SetupData>({
    basicInfo: null,
    notionConnection: null,
    selectedTheme: null,
  });
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 60;
  const [deploySteps, setDeploySteps] = useState<DeployStep[]>(INITIAL_STEPS);
  const [progress, setProgress] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = async () => {
    if (!setupData.basicInfo?.url || !setupData.notionConnection?.pageId) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "必要な情報が入力されていません",
      });
      return;
    }

    setIsDeploying(true);
    updateDeployStatus("INIT", "loading");

    try {
      // NotionページIDの検証
      const validateResponse = await fetch("/api/notion/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageId: setupData.notionConnection.pageId }),
      });

      const validateData = await validateResponse.json();

      if (!validateData.valid) {
        toast({
          variant: "destructive",
          title: "Notionデータベースエラー",
          description:
            validateData.error || "Notionデータベースの設定を確認してください",
        });
        setIsDeploying(false);
        return;
      }

      updateDeployStatus("INIT", "complete");
      updateDeployStatus("GITHUB", "loading");

      // デプロイメントの開始
      const deployResponse = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogUrl: setupData.basicInfo.url,
          pageId: setupData.notionConnection.pageId,
          theme: setupData.selectedTheme,
        }),
      });

      const deployData = await deployResponse.json();

      if (!deployResponse.ok) throw new Error(deployData.error);

      updateDeployStatus("GITHUB", "complete");
      // ビルドフェーズを開始
      updateDeployStatus("BUILD", "loading", "ビルドの準備中...");

      // デプロイメントの状態を監視
      const checkDeployment = async () => {
        if (attempts >= maxAttempts) {
          setIsDeploying(false);
          throw new Error("デプロイメントがタイムアウトしました");
        }

        try {
          const statusResponse = await fetch(
            `/api/deploy/status?deploymentId=${deployData.deploymentId}`
          );
          const statusData = await statusResponse.json();

          // 進捗状況とメッセージを更新
          switch (statusData.phase) {
            case "QUEUED":
              updateDeployStatus("BUILD", "loading", "ビルドキューに追加中...");
              break;
            case "INITIALIZING":
              updateDeployStatus(
                "BUILD",
                "loading",
                "依存関係をインストール中..."
              );
              break;
            case "BUILDING":
              updateDeployStatus("BUILD", "loading", "ビルド実行中...");
              break;
            case "READY":
              updateDeployStatus("BUILD", "complete", "ビルド完了");
              updateDeployStatus("DEPLOY", "complete", "デプロイ完了！");
              const cleanUrl = statusData.url.replace(/^https?:\/\//, "");
              localStorage.setItem("deployedBlogUrl", cleanUrl);
              router.push("/dashboard");
              return;
          }

          // 進捗が後退しないように保証
          setProgress((prevProgress) =>
            Math.max(prevProgress, statusData.buildProgress)
          );

          setAttempts((prev) => prev + 1);
          setTimeout(checkDeployment, 3000);
        } catch (error) {
          console.error("Failed to check deployment status:", error);
          updateDeployStatus("DEPLOY", "error");
        }
      };

      checkDeployment();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description:
          error instanceof Error
            ? error.message
            : "デプロイ中にエラーが発生しました",
      });
      console.error("Error during deployment:", error);
      setIsDeploying(false);
    }
  };

  const updateSetupData = (key: string, value: any) => {
    setSetupData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return Boolean(
          setupData.basicInfo?.url && setupData.basicInfo.url.length > 0
        );
      case 1:
        return Boolean(
          setupData.selectedTheme && setupData.selectedTheme.length > 0
        );
      case 2:
        return Boolean(
          setupData.notionConnection?.pageId &&
            setupData.notionConnection.pageId.length > 0
        );
      default:
        return false;
    }
  };

  const updateDeployStatus = (
    stepId: string,
    status: DeployStepStatus,
    description?: string
  ) => {
    setDeploySteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? { ...step, status, description: description || step.description }
          : step
      )
    );

    // 進捗状況を更新
    const stepIndex = deploySteps.findIndex((step) => step.id === stepId);
    if (status === "complete") {
      setProgress(((stepIndex + 1) / deploySteps.length) * 100);
    } else if (status === "loading") {
      setProgress((stepIndex / deploySteps.length) * 100);
    }
  };

  return (
    <Card className="w-full max-w-3xl p-12 bg-card/50 backdrop-blur-sm">
      {isDeploying && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg p-6"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">ブログを構築中...</h2>
                <div className="space-y-1">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-right">
                    {Math.round(progress)}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {deploySteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg transition-colors duration-200",
                      step.status === "complete" && "bg-emerald-500/10",
                      step.status === "loading" && "bg-primary/10",
                      step.status === "error" && "bg-destructive/10"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {step.status === "complete" && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", duration: 0.3 }}
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </motion.div>
                      )}
                      {step.status === "loading" && (
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      )}
                      {step.status === "error" && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      {step.status === "pending" && (
                        <div className="h-5 w-5 rounded-full border-2 border-muted" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-medium",
                          step.status === "complete" && "text-emerald-500",
                          step.status === "loading" && "text-primary",
                          step.status === "error" && "text-destructive"
                        )}
                      >
                        {step.label}
                      </p>
                      {step.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            セットアップ {activeStep + 1}/3
          </span>
          <Progress value={((activeStep + 1) / 3) * 100} className="w-40" />
        </div>

        <div className="min-h-[400px]">
          {activeStep === 0 && (
            <BasicInfoStep
              onUpdateData={(data: any) => updateSetupData("basicInfo", data)}
              initialValue={setupData.basicInfo?.url || ""}
            />
          )}
          {activeStep === 1 && (
            <ThemeSelectionStep
              onComplete={handleNext}
              onUpdateData={(theme) => updateSetupData("selectedTheme", theme)}
              initialValue={setupData.selectedTheme || null}
            />
          )}
          {activeStep === 2 && (
            <NotionSetupStep
              onNext={handleNext}
              onUpdateData={(data) => updateSetupData("notionConnection", data)}
              initialValue={setupData.notionConnection?.pageId || ""}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between">
        {activeStep > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            disabled={isDeploying}
          >
            戻る
          </Button>
        )}
        <Button
          className={`ml-auto ${
            !isStepValid(activeStep) || isDeploying ? "cursor-not-allowed" : ""
          }`}
          size="lg"
          onClick={() => {
            if (activeStep < 2) {
              handleNext();
            } else {
              handleComplete();
            }
          }}
          disabled={!isStepValid(activeStep) || isDeploying}
        >
          {activeStep === 2 ? (
            <>
              {isDeploying ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Rocket className="h-5 w-5" />
              )}
              {isDeploying ? "構築中..." : "完了"}
            </>
          ) : (
            <>
              次へ
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
