"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Not logged in → go to login page
    if (!session) {
      router.replace("/Login");
      return;
    }

    // Logged in but not onboarded → extra safety redirect
    const user = session.user as any;
    if (user && user.onboarded === false) {
      router.replace("/onboarding");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p>Loading...</p>
      </main>
    );
  }

  if (!session) return null; // already redirecting

  const user = session.user as any;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-1">
          Welcome back, {session.user?.name || "Volunteer"} 👋
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Logged in as <span className="font-mono">{session.user?.email}</span>
        </p>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-300">Onboarding status</p>
            <p className="text-lg font-medium mt-1">
              {user?.onboarded ? "✅ Completed" : "⚠️ Not completed"}
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            {!user?.onboarded && (
              <button
                onClick={() => router.push("/onboarding")}
                className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition"
              >
                Finish onboarding
              </button>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/Login" })}
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
