"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function GoogleLoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <button disabled>Loading...</button>;

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span>Hi, {session.user?.name}</span>
        <button onClick={() => signOut()} className="px-4 py-2 rounded border">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        // existing + onboarded users go to /dashboard
        // new/not-onboarded users get overridden to /onboarding by signIn callback
        signIn("google", { callbackUrl: "/dashboard" })
      }
      className="px-4 py-2 rounded border"
    >
      Continue with Google
    </button>
  );
}
