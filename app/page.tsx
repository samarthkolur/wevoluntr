import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";
import EventList from "@/components/EventList";

async function getEvents(location?: string) {
  // In a real server component, we can call the DB directly or fetch via absolute URL if API is separate.
  // Calling DB directly is better for Server Components to avoid HTTP roundtrip overhead.
  // However, to keep it consistent with the "API" requirement, I'll fetch or just mock the call here for simplicity if I can't easily reach the API URL (localhost issues).
  // Let's call the DB logic directly or use a helper.
  // For this MVP, I'll fetch from the API using a relative URL if possible, or just duplicate the logic slightly/import it.
  // Actually, importing the logic is best.
  // But `GET` is an export from route.ts.
  // Let's just use a client component for the listing to handle the search interactivity easily, 
  // and keep this page as the shell that checks auth.
  return [];
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    // Check if profile is complete
    // The session callback we wrote puts `isProfileComplete` on the session.user object
    if (!(session.user as any).isProfileComplete) {
      redirect("/onboarding");
    } else {
      const role = (session.user as any).role;
      if (role === "volunteer") {
        redirect("/dashboard/volunteer");
      } else if (role === "ngo_admin") {
        redirect("/dashboard/ngo");
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-lime-300 rounded-full border-2 border-black opacity-50 hidden md:block animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-lime-200 rotate-12 border-2 border-black opacity-50 hidden md:block"></div>

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <h1 className="text-6xl md:text-7xl font-black text-black tracking-tighter leading-tight">
            Make a Difference with <br />
            <span className="text-lime-500 inline-block transform -rotate-2 decoration-black underline decoration-4 underline-offset-4">Voluntr</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Connect with verified NGOs and find volunteering opportunities near you.
            Join our community of changemakers today.
          </p>
          
          <div className="max-w-lg mx-auto mt-12">
            <form action="/search" className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Enter your city..." 
                className="h-14 text-lg bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 flex-1 rounded-lg"
                name="location"
              />
              <Button size="lg" className="h-14 px-8 bg-black text-white hover:bg-gray-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(163,230,53,1)] hover:shadow-[2px_2px_0px_0px_rgba(163,230,53,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-bold text-lg rounded-lg">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t-2 border-dashed border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-4xl font-black text-black tracking-tight">Upcoming Opportunities</h2>
            <p className="text-gray-500 font-medium">Find the perfect role for you</p>
          </div>
          <Button variant="outline" className="h-12 px-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all bg-white hover:bg-lime-50 font-bold rounded-lg">
            View All Events
          </Button>
        </div>

        <EventList />
      </section>
    </div>
  );
}


