'use client';

import AuthProvider from "@/app/hooks/useAuth";

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
