import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useLocation } from "react-router-dom";

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
  // Si el contexto no existe o el planId está vacío, lo obtiene del URL
  if (!ctx || !ctx.planId) {
    // Extrae el planId del URL
    const params = useParams<{ plan?: string }>();
    const location = useLocation();
    // Busca el plan en los params o en la ruta
    const planIdFromUrl =
      params.plan ||
      location.pathname.split("/").find((_, i, arr) => arr[i - 1] === "student" || arr[i - 1] === "admin");
    return {
      planId: planIdFromUrl ?? null,
      setPlanId: () => {},
    };
  }
  return ctx;
}
