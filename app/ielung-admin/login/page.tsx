"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get("from");

  // Validate from parameter to prevent open redirect attacks
  const safeFrom =
    rawFrom &&
    rawFrom.startsWith("/") &&
    !rawFrom.startsWith("//") &&
    !rawFrom.includes(":")
      ? rawFrom
      : "/ielung-admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both email address and password.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Authentication failed. Please check credentials.");
          return;
        }

        // Successfully logged in; navigate to return path
        router.push(safeFrom);
        router.refresh();
      } catch {
        setError("Network error connecting to login service. Please try again.");
      }
    });
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-[#3D4749] text-white p-8 text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/15">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">IE Lung Admin Portal</h1>
        <p className="text-xs text-white/70 mt-1 uppercase tracking-wider font-semibold">
          Authorized Personnel Only
        </p>
      </div>

      {/* Login Form Body */}
      <div className="p-8">
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm animate-in fade-in duration-200"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1"
            >
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ielung.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-[#3D4749] hover:bg-[#252C2D] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying Session...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#3D4749]" />
            <p className="text-xs text-slate-400 mt-4 uppercase tracking-wider font-bold">
              Loading Portal...
            </p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
