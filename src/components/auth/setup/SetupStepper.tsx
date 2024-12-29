//14e1dcf229c28018bcbbe57ab6e92e8c
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ArrowRight, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BasicInfoStep } from "./BasicInfoStep";
import ThemeSelectionStep from "./ThemeSelectionStep";
import NotionSetupStep from "./NotionSetupStep";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { DeployStep } from "@/types/deploy";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { AuthStep } from "./AuthStep";

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
  const { isSignedIn } = useUser();
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

  useEffect(() => {
    if (isSignedIn && activeStep === 0) {
      setActiveStep(1);
    }
  }, [isSignedIn, activeStep]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = async () => {
    if (
      !setupData.basicInfo?.url ||
      !setupData.notionConnection?.pageId ||
      !setupData.selectedTheme
    ) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "必要な情報が入力されていません",
      });
      return;
    }

    setIsDeploying(true);

    try {
      // NotionページIDの検証
      const validateResponse = await fetch("/api/notion/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      // デプロイメントの開始
      const deployResponse = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogUrl: setupData.basicInfo.url,
          pageId: setupData.notionConnection.pageId,
          theme: setupData.selectedTheme,
        }),
      });

      const deployData = await deployResponse.json();
      if (!deployResponse.ok) throw new Error(deployData.error);

      // デプロイ情報をローカルストレージに保存
      localStorage.setItem("deploymentId", deployData.deploymentId);
      localStorage.setItem("blogUrl", setupData.basicInfo.url);
      localStorage.setItem("setupData", JSON.stringify(setupData));

      // すぐにダッシュボードへ遷移
      router.push("/dashboard?deploying=true");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description:
          error instanceof Error ? error.message : "デプロイに失敗しました",
      });
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
      case 0: // 認証ステップ
        return isSignedIn ?? false;
      case 1: // URLの設定
        return Boolean(
          setupData.basicInfo?.url && setupData.basicInfo.url.length > 0
        );
      case 2: // テーマ選択
        return Boolean(
          setupData.selectedTheme && setupData.selectedTheme.length > 0
        );
      case 3: // Notion設定
        return Boolean(
          setupData.notionConnection?.pageId &&
            setupData.notionConnection.pageId.length > 0
        );
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-3xl p-12 bg-card/50 backdrop-blur-sm">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            セットアップ {activeStep + 1}/4
          </span>
          <Progress value={((activeStep + 1) / 4) * 100} className="w-40" />
        </div>

        <div className="min-h-[400px]">
          {activeStep === 0 && !isSignedIn && <AuthStep />}
          {activeStep === 1 && (
            <BasicInfoStep
              onUpdateData={(data) => updateSetupData("basicInfo", data)}
              initialValue={setupData.basicInfo?.url || ""}
            />
          )}
          {activeStep === 2 && (
            <ThemeSelectionStep
              onUpdateData={(theme) => updateSetupData("selectedTheme", theme)}
              initialValue={setupData.selectedTheme || null}
            />
          )}
          {activeStep === 3 && (
            <NotionSetupStep
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
          className="ml-auto"
          size="lg"
          onClick={() => {
            if (activeStep < 3) {
              handleNext();
            } else {
              handleComplete();
            }
          }}
          disabled={!isStepValid(activeStep) || isDeploying}
        >
          {activeStep === 3 ? (
            <>
              {isDeploying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="hidden sm:inline">
                    ダッシュボードへ移動中...
                  </span>
                  <span className="sm:hidden">移動中...</span>
                </>
              ) : (
                <>
                  <Rocket className="h-5 w-5 mr-2" />
                  <span>完了</span>
                </>
              )}
            </>
          ) : (
            <>
              次へ
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
