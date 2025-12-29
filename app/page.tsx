import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import User from "@/models/User";
import Ngo from "@/models/Ngo";
import { EventCard } from "@/components/EventCard";
import { ArrowRight, Globe, Heart, Users } from "lucide-react";

async function getData() {
  await connectDB();

  // Fetch stats (cached/approximate for performance in real app, but direct here for prototype)
  const stats = {
    volunteers: await User.countDocuments({ role: "volunteer" }),
    ngos: await Ngo.countDocuments({ verificationStatus: "verified" }),
    impactHours: (await Event.countDocuments({ status: "completed" })) * 4, // Mock calculation
  };

  // Fetch featured events (e.g. soonest 3)
  const featuredEventsDocs = await Event.find({ status: "open" })
    .populate("ngoId", "name logoUrl")
    .sort({ date: 1 })
    .limit(3)
    .lean();

  const featuredEvents = JSON.parse(JSON.stringify(featuredEventsDocs));

  return { stats, featuredEvents };
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
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

  const { stats, featuredEvents } = await getData();

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center relative overflow-hidden bg-white">
        {/* Decorative elements */}
        <div
          className="absolute top-20 left-10 w-24 h-24 bg-lime-300 rounded-full border-4 border-black opacity-100 hidden md:block animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          style={{ animationDuration: "3s" }}
        ></div>
        <div className="absolute bottom-40 right-10 w-32 h-32 bg-purple-300 rotate-12 border-4 border-black opacity-100 hidden md:block shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"></div>

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="inline-block px-4 py-2 bg-lime-100 border-2 border-black rounded-full text-sm font-black mb-4 transform -rotate-2">
            JOINED {stats.volunteers}+ VOLUNTEERS
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-none">
            Make a <br />
            Difference with <br />
            <span className="text-lime-500 inline-block transform -rotate-1 underline decoration-black underline-offset-8 decoration-4">
              Voluntr.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 font-bold max-w-2xl mx-auto leading-relaxed">
            Connect with verified NGOs and find volunteering opportunities near
            you. Your time can change lives.
          </p>

          <div className="max-w-lg mx-auto mt-12 bg-white p-2 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <form
              action="/discover"
              className="flex flex-col sm:flex-row gap-2"
            >
              <Input
                placeholder="Find opportunities in your city..."
                className="h-12 text-lg bg-gray-50 border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 flex-1 rounded-lg font-bold"
                name="location"
              />
              <Button
                size="lg"
                className="h-12 px-8 bg-lime-400 text-black hover:bg-lime-500 border-2 border-black font-black text-lg rounded-lg"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black text-white border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center mb-2">
              <Users size={40} className="text-lime-400" />
            </div>
            <div className="text-5xl font-black">{stats.volunteers}</div>
            <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              Active Volunteers
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center mb-2">
              <Globe size={40} className="text-purple-400" />
            </div>
            <div className="text-5xl font-black">{stats.ngos}</div>
            <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              Verified NGOs
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center mb-2">
              <Heart size={40} className="text-red-400" />
            </div>
            <div className="text-5xl font-black">{stats.impactHours}+</div>
            <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              Impact Hours
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-5xl font-black text-black tracking-tighter">
              Featured Opportunities
            </h2>
            <p className="text-xl font-bold text-gray-500">
              Curated events happening soon near you.
            </p>
          </div>
          <Link href="/discover">
            <Button
              variant="outline"
              className="h-12 px-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all bg-white hover:bg-lime-50 font-black text-lg rounded-lg flex items-center gap-2"
            >
              View All <ArrowRight size={20} />
            </Button>
          </Link>
        </div>

        {featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-xl font-bold text-gray-400">
              No events currently available.
            </p>
            <p className="text-gray-400">Please check back later.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-lime-300 border-t-2 border-black">
        <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
            Ready to start your journey?
          </h2>
          <p className="text-xl font-bold">
            Join thousands of volunteers making a tangible difference in their
            communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button className="h-14 px-10 bg-black text-white hover:bg-gray-800 border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[3px] hover:translate-x-[3px] transition-all font-black text-xl rounded-xl">
                Join as Volunteer
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="h-14 px-10 bg-white text-black border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[3px] hover:translate-x-[3px] transition-all font-black text-xl rounded-xl"
              >
                Register as NGO
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
