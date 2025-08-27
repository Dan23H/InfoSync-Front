import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type TabsContextType = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState("stats"); // aquí va el valor inicial 

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabs debe usarse dentro de <TabsProvider>");
  return ctx;
};