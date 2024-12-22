export type DeployStepStatus = "pending" | "loading" | "complete" | "error";

export interface DeployStep {
  id: string;
  label: string;
  status: DeployStepStatus;
  description?: string;
}

export const INITIAL_STEPS: DeployStep[] = [
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
    description: "Webサイトを公開しています",
  },
];
