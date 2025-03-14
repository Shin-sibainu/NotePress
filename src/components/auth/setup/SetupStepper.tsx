"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BasicInfoStep } from "./BasicInfoStep";
import ThemeSelectionStep from "./ThemeSelectionStep";
import NotionSetupStep from "./NotionSetupStep";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AuthStep } from "./AuthStep";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { SetupProvider } from "./SetupContext";
import { templates } from "@/data/templates";
import { loadStripe } from "@stripe/stripe-js";

interface SetupData {
  basicInfo: { url: string | null } | null;
  notionConnection: { pageId: string | null } | null;
  selectedTheme: string | null;
}

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
  const [isNavigating, setIsNavigating] = useState(false);

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

  const handleComplete = useCallback(async () => {
    if (isDeploying || isNavigating) return;

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

    // 選択されたテーマの情報を取得
    const selectedTemplate = templates.find(
      (t) => t.id === setupData.selectedTheme
    );
    const requiresPayment = selectedTemplate && selectedTemplate.price > 0;

    if (requiresPayment) {
      try {
        // Stripe Checkout セッションを作成
        const response = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            templateId: selectedTemplate.id,
            price: selectedTemplate.price,
            pageId: setupData.notionConnection.pageId,
            blogUrl: setupData.basicInfo.url,
          }),
        });

        const responseData = await response.json();

        // エラーレスポンスの場合は早期リターン
        if (!response.ok) {
          throw new Error(
            `API Error: ${responseData.error || "Unknown error"}`
          );
        }

        const { sessionId } = responseData;

        // sessionIdが存在するか確認
        if (!sessionId) {
          throw new Error("No sessionId returned from API");
        }

        // Stripeのチェックアウトページにリダイレクト
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );

        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        } else {
          throw new Error("Failed to load Stripe");
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast({
          variant: "destructive",
          title: "エラー",
          description: "決済の処理中にエラーが発生しました",
        });
      }
      return;
    }

    // 無料テーマの場合は通常のデプロイフロー
    try {
      setIsDeploying(true);
      setIsNavigating(true);

      // 1. Notionページの形式をバリデーション
      const validateRes = await fetch("/api/notion/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: setupData.notionConnection.pageId }),
      });

      const validateData = await validateRes.json();
      if (!validateData.valid) {
        throw new Error(
          validateData.error || "Notionページの形式が正しくありません"
        );
      }

      // console.log(validateRes);

      // 2. ブログ作成処理
      const blogResponse = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: setupData.basicInfo.url,
          notionPageId: setupData.notionConnection.pageId,
          theme: setupData.selectedTheme,
        }),
      });

      const blogData = await blogResponse.json();

      // console.log(blogData)

      if (!blogResponse.ok) {
        if (blogResponse.status === 409) {
          setIsNavigating(false);
          setIsDeploying(false);
          toast({
            variant: "destructive",
            title: "エラー",
            description:
              "ドメインが既に利用されています。ブログURL設定を変更してください。",
          });
          setActiveStep(1);
          return;
        }
        throw new Error(blogData.error || "ブログの作成に失敗しました");
      }

      // デプロイ実行 (ここでエラー中...)
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

      if (!deployResponse.ok) {
        // ドメイン重複エラーの場合
        if (deployResponse.status === 409) {
          toast({
            variant: "destructive",
            title: "エラー",
            description: deployData.error || "このURLは既に使用されています",
          });
          setIsNavigating(false);
          setIsDeploying(false);
          return;
        }
        throw new Error(deployData.error || "デプロイに失敗しました");
      }

      // デプロイIDを保存
      localStorage.setItem("deploymentId", deployData.deploymentId);
      localStorage.setItem("blogUrl", setupData.basicInfo.url);

      router.push("/dashboard?deploying=true");
    } catch (error) {
      setIsNavigating(false);
      setIsDeploying(false);

      if (
        error instanceof Error &&
        error.message.includes("Repository already exists")
      ) {
        toast({
          variant: "destructive",
          title: "エラー",
          description:
            "ドメインが既に利用されています。ブログURL設定を変更してください。",
        });
        setActiveStep(1);
        return;
      }

      toast({
        variant: "destructive",
        title: "エラー",
        description:
          error instanceof Error ? error.message : "セットアップに失敗しました",
      });
    }
  }, [setupData, isDeploying, isNavigating, toast, router]);

  const handleUpdateData = useCallback((data: Partial<SetupData>) => {
    setSetupData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const handleBasicInfoUpdate = useCallback(
    (data: { url: string }) => {
      handleUpdateData({ basicInfo: data });
    },
    [handleUpdateData]
  );

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

  const selectedTemplate = templates.find(
    (t) => t.id === setupData.selectedTheme
  );
  const requiresPayment = selectedTemplate && selectedTemplate.price > 0;

  return (
    <SetupProvider>
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
                onUpdateData={handleBasicInfoUpdate}
                initialValue={setupData.basicInfo?.url || ""}
              />
            )}
            {activeStep === 2 && (
              <ThemeSelectionStep
                onUpdateData={(theme) =>
                  handleUpdateData({ selectedTheme: theme })
                }
                initialValue={setupData.selectedTheme || null}
              />
            )}
            {activeStep === 3 && (
              <NotionSetupStep
                onUpdateData={(data) =>
                  handleUpdateData({ notionConnection: data })
                }
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
                ) : requiresPayment ? (
                  <>
                    <span>決済へ進む</span>
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
      {isNavigating && <LoadingOverlay />}
    </SetupProvider>
  );
}
