'use client';
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string | null;
  email: string | null;
  username?: string | null;
  name?: string | null;
  profile_img?: string | null;
  is_verified?: boolean | null;
};

type AuthContextType = {
  authenticating: boolean;
  setAuthenticating: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [authenticating, setAuthenticating] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const refreshAccessToken = async () => {
    try {
      const res = await fetch("/api/user/token/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error("Failed to refresh token:", err);
      return false;
    }
  };

  const fetchUser = async () => {
    setAuthenticating(true);
    try {
      let res = await fetch("/api/user/details", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // If token expired → try refresh once
      if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          res = await fetch("/api/user/details", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      const data = await res.json();
      if (data.success) setUser(data.data);
      else setUser(null);
    } catch (err) {
      console.error("Failed fetching user:", err);
      setUser(null);
    } finally {
      setAuthenticating(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticating, setAuthenticating, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
