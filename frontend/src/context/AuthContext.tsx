import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../api/auth.api";
import type { User, AuthResponse } from "../types";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) loadUser();
    else setLoading(false);
  }, []);

  const loadUser = async () => {
    try {
      const r = await authAPI.getProfile();
      setUser(r.data.data.user);
    } catch { logout(); }
    finally { setLoading(false); }
  };

  const login = async (email: string, password: string) => {
    const r = await authAPI.login({ email, password });
    const { token: t, user: u } = r.data.data;
    localStorage.setItem("token", t); localStorage.setItem("user", JSON.stringify(u));
    setToken(t); setUser(u);
    return r.data;
  };

  const register = async (name: string, email: string, password: string) => {
    const r = await authAPI.register({ name, email, password });
    const { token: t, user: u } = r.data.data;
    localStorage.setItem("token", t); localStorage.setItem("user", JSON.stringify(u));
    setToken(t); setUser(u);
    return r.data;
  };

  const logout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user");
    setToken(null); setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}