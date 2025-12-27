"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, Search, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { EventCard } from "./EventCard";
import { ApplicationsList } from "./ApplicationsList";

interface VolunteerDashboardProps {
  user: any;
  myEvents: any[];
}

export function VolunteerDashboardContent({ user, myEvents }: VolunteerDashboardProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "applications">("upcoming");
  const completedEvents = myEvents?.filter(e => e.status === 'completed') || [];
  const upcomingEvents = myEvents?.filter(e => e.status !== 'completed') || [];
  const hoursVolunteered = completedEvents.length * 4; // Assuming 4 hours per event for now

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-black pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Volunteer Dashboard</h1>
            <p className="text-gray-500 font-bold mt-1">Ready to make a difference, {user?.name}?</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/discover">
                 <Button className="bg-black text-white hover:bg-gray-800 font-bold border-2 border-transparent">
                     <Search className="mr-2 h-4 w-4" /> Find Opportunities
                 </Button>
            </Link>
            <Button 
                variant="outline" 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-bold text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-lime-50">
            <CardHeader className="pb-2 border-b-2 border-black/10">
              <CardTitle className="font-bold text-sm text-gray-500 uppercase">Total Impact</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-5xl font-black text-lime-600 mb-2">{hoursVolunteered}</div>
              <p className="font-bold text-gray-700">Hours Volunteered</p>
              <p className="text-xs text-gray-500 mt-2">{completedEvents.length} events completed</p>
            </CardContent>
          </Card>

           <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-blue-50">
            <CardHeader className="pb-2 border-b-2 border-black/10">
              <CardTitle className="font-bold text-sm text-gray-500 uppercase">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-5xl font-black text-blue-600 mb-2">{upcomingEvents.length}</div>
              <p className="font-bold text-gray-700">Scheduled Events</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-purple-50">
             <CardHeader className="pb-2 border-b-2 border-black/10">
              <CardTitle className="font-bold text-sm text-gray-500 uppercase">My Profile</CardTitle>
            </CardHeader>
             <CardContent className="p-6 space-y-2">
                 <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Location</span>
                    <p className="font-bold">{user?.location || "Not set"}</p>
                 </div>
                 <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Skills</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {user.skills?.map((s: string) => (
                            <span key={s} className="text-xs bg-white border border-black px-1 rounded">{s}</span>
                        )) || "None listed"}
                    </div>
                 </div>
             </CardContent>
          </Card>
        </div>

        <div className="border-b-2 border-black flex gap-6">
            <button 
                onClick={() => setActiveTab('upcoming')}
                className={`text-xl font-black py-2 border-b-4 transition-colors ${activeTab === 'upcoming' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                Confirmed Events
            </button>
            <button 
                onClick={() => setActiveTab('applications')}
                className={`text-xl font-black py-2 border-b-4 transition-colors ${activeTab === 'applications' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                My Applications
            </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             {activeTab === 'upcoming' ? (
                 <>
                    {upcomingEvents.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50">
                            <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                            <p className="font-bold text-gray-400">You have no scheduled events.</p>
                            <Link href="/discover">
                                <Button className="mt-4" variant="outline">Browse Opportunities</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    )}
                 </>
             ) : (
                 <ApplicationsList />
             )}
        </div>
      </div>
    </div>
  );
}
