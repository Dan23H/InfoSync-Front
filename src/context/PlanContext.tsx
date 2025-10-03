  import { createContext, useContext, useState } from "react";
  import type { ReactNode } from "react";

  interface PlanContextType {
    planId: string | null;
    setPlanId: (id: string | null) => void;
  }

  const PlanContext = createContext<PlanContextType | undefined>(undefined);

  export function PlanProvider({ children }: { children: ReactNode }) {
    const [planId, setPlanId] = useState<string | null>(null);

    return (
      <PlanContext.Provider value={{ planId, setPlanId }}>
        {children}
      </PlanContext.Provider>
    );
  }

  export function usePlan() {
    const ctx = useContext(PlanContext);
    if (!ctx) throw new Error("usePlan debe usarse dentro de PlanProvider");
    return ctx;
  }
