"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
      {/* Header Banner with Official White Logo */}
      <div className="bg-[#3D4749] text-white p-8 text-center flex flex-col items-center">
        <Link href="/" className="inline-block mb-3 hover:opacity-90 transition-opacity">
          <Image
            src="/logo_white.png"
            alt="Inland Empire Lung & Sleep Institute"
            width={160}
            height={46}
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
        <p className="text-xs text-white/70 mt-1 font-medium">
          Sign in to manage clinical articles, downloads, and photography
        </p>
      </div>

      {/* Login Form Body */}
      <div className="p-6 sm:p-8">
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm animate-in fade-in duration-200"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ielung.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A389]/20 focus:border-[#00A389] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A389]/20 focus:border-[#00A389] transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-3 bg-[#00A389] hover:bg-[#008f78] text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
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
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-2xl p-12 text-center shadow-md border border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00A389]" />
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
