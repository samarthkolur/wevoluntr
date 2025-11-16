"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // if somehow user is already onboarded, send to dashboard
    if (session?.user && (session.user as any).onboarded) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You must sign in first.</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome, {session.user?.name}
      </h1>
      <p>Finish your onboarding here… (form, preferences, etc.)</p>
      {/* after saving onboarding in DB, set onboarded: true and redirect to /dashboard */}
    </main>
  );
}
