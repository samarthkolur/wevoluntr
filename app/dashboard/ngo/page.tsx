import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Ngo from "@/models/Ngo";
import { NgoDashboardContent } from "@/components/NgoDashboardContent";

export default async function NGODashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "ngo_admin") {
    redirect("/dashboard/volunteer");
  }

  await connectDB();
  
  // Fetch NGO Details
  const ngoDoc = await Ngo.findOne({ adminId: (session.user as any).id }).lean();
  const ngo = ngoDoc ? JSON.parse(JSON.stringify(ngoDoc)) : null;

  // Fetch Events
  const eventsDocs = ngo ? await Event.find({ ngoId: ngo._id }).sort({ createdAt: -1 }).lean() : [];
  const events = JSON.parse(JSON.stringify(eventsDocs));

  return <NgoDashboardContent user={session.user} ngo={ngo} events={events} />;
}
