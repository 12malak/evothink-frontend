"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MockUser, Role, ROLE_DASHBOARD } from "@/src/lib/mock-users";

interface AuthContextType {
  user: MockUser | null;
  login: (user: MockUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  dashboardPath: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  dashboardPath: "/auth/login",
});

const SESSION_KEY = "evothink_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  // Rehydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const login = (u: MockUser) => {
    setUser(u);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const dashboardPath = user ? ROLE_DASHBOARD[user.role] : "/auth/login";

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, dashboardPath }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}