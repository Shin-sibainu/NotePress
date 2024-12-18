//14e1dcf229c28018bcbbe57ab6e92e8c
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  ArrowRight,
  Loader2,
  Rocket,
  Circle,
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

interface SetupData {
  basicInfo: { url: string } | null;
  notionConnection: { pageId: string } | null;
  selectedTheme: string;
}

export function SetupStepper() {
  const { toast } = useToast();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [setupData, setSetupData] = useState<SetupData>({
    basicInfo: null,
    notionConnection: null,
    selectedTheme: "",
  });
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 60;

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
          description: "無効なNotionページIDです。再度お確かめください。",
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
      updateDeployStatus("VERCEL", "loading");

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

          // フェーズに基づいてステータスを更新
          if (statusData.phase === "QUEUED") {
            updateDeployStatus("BUILD", "loading");
            setDeployProgress((prev) => ({ ...prev, BUILD: 30 }));
          } else if (statusData.phase === "INITIALIZING") {
            updateDeployStatus("BUILD", "loading");
            setDeployProgress((prev) => ({ ...prev, BUILD: 50 }));
          } else if (statusData.phase === "BUILDING") {
            updateDeployStatus("BUILD", "loading");
            const progress = Math.min(100, (attempts / (maxAttempts / 2)) * 100);
            setDeployProgress((prev) => ({ ...prev, BUILD: progress }));
            setAttempts((prev) => prev + 1);
          } else if (statusData.phase === "DEPLOYING") {
            updateDeployStatus("BUILD", "complete");
            updateDeployStatus("DEPLOY", "loading");
            setDeployProgress((prev) => ({ ...prev, DEPLOY: 50 }));
          } else if (statusData.status === "READY") {
            updateDeployStatus("DEPLOY", "complete");
            setDeployProgress((prev) => ({ ...prev, DEPLOY: 100 }));
            // デプロイ完了
            setTimeout(() => {
              router.push(`/dashboard?url=${statusData.url}`);
            }, 2000);
            return;
          }

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
          error instanceof Error ? error.message : "デプロイ中にエラーが発生しました",
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

  type DeployStep = {
    id: string;
    label: string;
    status: "pending" | "loading" | "complete" | "error";
  };

  const deploySteps: DeployStep[] = [
    { id: "INIT", label: "初期化", status: "pending" },
    { id: "GITHUB", label: "リポジトリ作成", status: "pending" },
    { id: "BUILD", label: "ビルド", status: "pending" },
    { id: "DEPLOY", label: "デプロイ", status: "pending" },
  ];

  const [deployStatus, setDeployStatus] = useState<DeployStep[]>(deploySteps);

  // ステップの更新関数
  const updateDeployStatus = (
    stepId: string,
    status: "pending" | "loading" | "complete" | "error"
  ) => {
    setDeployStatus((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const [deployProgress, setDeployProgress] = useState<Record<string, number>>({
    INIT: 0,
    GITHUB: 0,
    VERCEL: 0,
    BUILD: 0,
    DEPLOY: 0,
  });

  return (
    <Card className="w-full max-w-3xl p-12 bg-card/50 backdrop-blur-sm">
      {isDeploying && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-50">
          <div className="text-center space-y-6 max-w-md w-full px-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">ブログを構築中...</p>

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
                      value={
                        step.status === "complete"
                          ? 100
                          : step.status === "loading"
                          ? deployProgress[step.id]
                          : 0
                      }
                      className="h-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
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
              onUpdateData={(data) => updateSetupData("basicInfo", data)}
            />
          )}
          {activeStep === 1 && (
            <ThemeSelectionStep
              onComplete={handleNext}
              onUpdateData={(theme) => updateSetupData("selectedTheme", theme)}
            />
          )}
          {activeStep === 2 && (
            <NotionSetupStep
              onNext={handleNext}
              onUpdateData={(data) => updateSetupData("notionConnection", data)}
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
