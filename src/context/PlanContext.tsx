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
  const params = useParams<{ plan?: string }>();
  const location = useLocation();

  // Extrae planId desde la URL como fallback
  const planIdFromUrl =
    params.plan ||
    location.pathname.split("/").find((_, i, arr) => arr[i - 1] === "student" || arr[i - 1] === "admin");

  if (!ctx) {
    // Si no hay provider, devolvemos un objeto que expone planId desde la URL
    return {
      planId: planIdFromUrl ?? null,
      setPlanId: (id: string | null) => {
        // No podemos actualizar sin provider; avisar en consola para debugging
        // Esto evita que componentes confíen en un setter que no funciona.
        // eslint-disable-next-line no-console
        console.warn("usePlan called outside PlanProvider - setPlanId ignored", id);
      },
    };
  }

  // Si el provider existe, preferimos su planId cuando esté definido; si es null usamos el fallback de URL
  return {
    planId: ctx.planId ?? (planIdFromUrl ?? null),
    setPlanId: ctx.setPlanId,
  };
}
