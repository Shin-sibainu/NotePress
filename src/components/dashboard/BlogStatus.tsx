"use client";

import { useEffect, useState } from "react";
import { DeploymentProgress } from "./deployment-progress";

export default function BlogStatus() {
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

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
