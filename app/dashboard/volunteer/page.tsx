import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function VolunteerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "volunteer") {
    redirect("/dashboard/ngo");
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b-2 border-black pb-6">
          <h1 className="text-4xl font-black text-black tracking-tight">
            Volunteer Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">Welcome, {session.user?.name}</span>
            <Button variant="outline" className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-bold">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <CardHeader className="bg-lime-100 border-b-2 border-black">
              <CardTitle className="font-bold text-xl">My Impact</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-4xl font-black text-lime-600 mb-2">0</div>
              <p className="text-gray-600 font-medium">Hours Volunteered</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <CardHeader className="bg-lime-100 border-b-2 border-black">
              <CardTitle className="font-bold text-xl">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-500 italic">No upcoming events registered.</p>
              <Button className="mt-4 w-full bg-black text-white hover:bg-gray-800 font-bold">
                Find Opportunities
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <CardHeader className="bg-lime-100 border-b-2 border-black">
              <CardTitle className="font-bold text-xl">Recommended</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-500">Based on your skills: Teaching, Coding</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
