import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function NGODashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "ngo_admin") {
    redirect("/dashboard/volunteer");
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b-2 border-black pb-6">
          <h1 className="text-4xl font-black text-black tracking-tight">
            NGO Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">Welcome, {session.user?.name}</span>
            <Button variant="outline" className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-bold">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl md:col-span-2">
            <CardHeader className="bg-lime-100 border-b-2 border-black flex flex-row justify-between items-center">
              <CardTitle className="font-bold text-xl">My Events</CardTitle>
              <Button size="sm" className="bg-black text-white hover:bg-gray-800 font-bold flex items-center gap-2">
                <Plus size={16} /> Create Event
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-10 text-gray-500">
                <p>You haven't created any events yet.</p>
                <p className="text-sm">Create your first event to start recruiting volunteers.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <CardHeader className="bg-lime-100 border-b-2 border-black">
              <CardTitle className="font-bold text-xl">Organization Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="text-3xl font-black text-lime-600">0</div>
                <p className="text-gray-600 font-medium">Active Volunteers</p>
              </div>
              <div>
                <div className="text-3xl font-black text-lime-600">0</div>
                <p className="text-gray-600 font-medium">Total Events</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
