import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import { VolunteerDashboardContent } from "@/components/VolunteerDashboardContent";
import User from "@/models/User";

export default async function VolunteerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "volunteer") {
    redirect("/dashboard/ngo");
  }

  await connectDB();

  // Fetch full user details (including location, skills etc which might not be in session)
  const userDoc = await User.findById((session.user as any).id).lean();
  const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : session.user;

  // Fetch My Events
  const myEventsDocs = await Event.find({ attendees: (session.user as any).id })
    .populate("ngoId", "name logoUrl")
    .sort({ date: 1 })
    .lean();
    
  const myEvents = JSON.parse(JSON.stringify(myEventsDocs));

  return <VolunteerDashboardContent user={user} myEvents={myEvents} />;
}
