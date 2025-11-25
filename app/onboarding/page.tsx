import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OnboardingFlow from "@/components/OnboardingFlow";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (session?.user && (session.user as any).isProfileComplete) {
    const role = (session.user as any).role;
    if (role === "volunteer") {
      redirect("/dashboard/volunteer");
    } else if (role === "ngo_admin") {
      redirect("/dashboard/ngo");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <OnboardingFlow />
    </main>
  );
}
