import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Checking your session…</div>;
  }
  if (status === "guest") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <>{children}</>;
}