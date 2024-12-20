export type DeployStepStatus = 'pending' | 'loading' | 'complete' | 'error';

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
    id: "GITHUB_INIT",
    label: "GitHubリポジトリ作成",
    status: "pending",
    description: "リポジトリを作成しています",
  },
  {
    id: "GITHUB_PUSH",
    label: "コード転送",
    status: "pending",
    description: "ソースコードを転送しています",
  },
  {
    id: "VERCEL_INIT",
    label: "Vercelプロジェクト作成",
    status: "pending",
    description: "デプロイ環境を準備しています",
  },
  {
    id: "BUILD_INIT",
    label: "ビルド準備",
    status: "pending",
    description: "依存関係をインストールしています",
  },
  {
    id: "BUILD_COMPILE",
    label: "ビルド実行",
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