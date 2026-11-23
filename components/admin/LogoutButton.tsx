"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  variant?: "header" | "sidebar";
}

export default function LogoutButton({
  className,
  variant = "sidebar",
}: LogoutButtonProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    if (isPending) return;
    setIsPending(true);

    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      setIsDialogOpen(false);
      router.push("/ielung-admin/login");
      router.refresh();
    } catch {
      setIsDialogOpen(false);
      router.push("/ielung-admin/login");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
        className={cn(
          "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 transition-colors disabled:opacity-50",
          className,
        )}
        title="Sign out of administration"
      >
        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
        <span>Sign Out</span>
      </button>

      {/* Accessible Logout Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={(open) => !isPending && setIsDialogOpen(open)}>
        <AlertDialogContent className="bg-white rounded-2xl max-w-md p-6 border border-slate-200/80 shadow-xl">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-bold text-[#3D4749]">
              Sign out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500 leading-relaxed">
              Are you sure you want to sign out of the admin panel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-3 pt-3">
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold !text-black hover:!text-black focus:!text-black active:!text-black text-black hover:text-black bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Cancel
            </AlertDialogCancel>
            <button
              type="button"
              disabled={isPending}
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <span>Sign out</span>
              )}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
