import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type User = any;

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  updateLocalUser: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const normalized = { ...parsed, userId: (parsed.userId ?? parsed._id), _id: (parsed._id ?? parsed.userId) };
      setUser(normalized);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, user: User) => {
    // Normalize user shape: some components expect user._id, others user.userId
    const normalizedUser = { ...user, userId: (user.userId ?? user._id), _id: (user._id ?? user.userId) };
    setToken(token);
    setUser(normalizedUser);
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const handleUpdateLocalUser = (updatedUser: User) => {
    const normalizedUser = { ...updatedUser, userId: (updatedUser.userId ?? updatedUser._id), _id: (updatedUser._id ?? updatedUser.userId) };
    setUser(normalizedUser);
    // keep existing token
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login: handleLogin, updateLocalUser: handleUpdateLocalUser, logout: handleLogout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
