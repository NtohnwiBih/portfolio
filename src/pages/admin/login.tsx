import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useAdminHead } from "@/components/admin/AdminLayout";

export default function AdminLogin() {
  useAdminHead("Sign in — Admin CMS");
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const target = from && from.startsWith("/admin") && from !== "/admin/login" ? from : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to={target} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const result = await login(email.trim(), password);
    setBusy(false);
    setPassword("");
    if (result.ok) navigate(target, { replace: true });
    else setError(result.error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-8">
        <div>
          <Lock className="h-6 w-6 text-accent" />
          <h1 className="mt-3 font-heading text-2xl font-bold text-foreground">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the portfolio.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" type="email" autoComplete="username" autoFocus required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="admin-password">Password</Label>
          <Input id="admin-password" type="password" autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={busy || !email || !password}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}