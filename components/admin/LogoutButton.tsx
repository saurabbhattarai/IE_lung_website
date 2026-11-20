"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  variant?: "header" | "sidebar";
}

export default function LogoutButton({
  className,
  variant = "header",
}: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    if (isPending) return;
    setIsPending(true);

    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      router.push("/ielung-admin/login");
      router.refresh();
    } catch {
      router.push("/ielung-admin/login");
    } finally {
      setIsPending(false);
    }
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        className={cn(
          "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/80 transition-colors disabled:opacity-50",
          className,
        )}
        title="Sign out of administration"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span>{isPending ? "Signing out..." : "Sign Out"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors disabled:opacity-50 shadow-sm",
        className,
      )}
      title="Sign out of administration"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">{isPending ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
