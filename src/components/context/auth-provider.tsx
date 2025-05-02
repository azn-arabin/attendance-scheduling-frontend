import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { Batch } from "@/lib/types.ts";

type Role = "student" | "instructor" | "admin";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  batch: Batch;
}

interface AuthData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

interface AuthContextType {
  user: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (data: AuthData) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
