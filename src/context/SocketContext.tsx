import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
// Note: requires socket.io-client dependency
// We'll dynamically import socket.io-client inside useEffect to avoid bundler resolution errors
// note: we use dynamic import; no top-level socket client reference required

interface SocketContextType {
  socket: any | null;
  connected: boolean;
  emitEvent: (event: string, data: any) => void;
  onEvent: (event: string, callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<any | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // dynamic import
        const mod = await import("socket.io-client");
        if (!mounted) return;
        const client = mod.default ?? mod;
        const url = (import.meta.env.VITE_API_URL as string) || undefined;
        const socketUrl = url ? url.replace(/\/api\/?$/, "") : undefined;
        
        const s = client(socketUrl ?? window.location.origin, {
          transports: ["websocket"],
          autoConnect: true,
        });

        setSocket(s);

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        s.on("connect", onConnect);
        s.on("disconnect", onDisconnect);

        // cleanup
        return () => {
          s.off("connect", onConnect);
          s.off("disconnect", onDisconnect);
          s.close();
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("socket.io-client not available. Install it with `npm i socket.io-client` to enable real-time updates.", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const emitEvent = (event: string, data: any) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  const onEvent = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const value = useMemo(() => ({ socket, connected, emitEvent, onEvent }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) return { socket: null, connected: false, emitEvent: () => {}, onEvent: () => {} };
  return ctx;
}

export default SocketContext;
