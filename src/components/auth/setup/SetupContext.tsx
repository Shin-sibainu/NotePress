import { createContext, useContext, useState, ReactNode } from "react";

interface SetupData {
  theme: string | null;
  pageId: string | null;
  basicInfo: {
    name: string;
    description: string;
  } | null;
}

interface SetupContextType {
  setupData: SetupData;
  updateSetupData: (data: Partial<SetupData>) => void;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export function SetupProvider({ children }: { children: ReactNode }) {
  const [setupData, setSetupData] = useState<SetupData>({
    theme: null,
    pageId: null,
    basicInfo: null,
  });

  const updateSetupData = (newData: Partial<SetupData>) => {
    setSetupData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <SetupContext.Provider value={{ setupData, updateSetupData }}>
      {children}
    </SetupContext.Provider>
  );
}

export function useSetupContext() {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error("useSetupContext must be used within a SetupProvider");
  }
  return context;
}
