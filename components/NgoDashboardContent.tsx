"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, FileText, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { EventCard } from "./EventCard";
import { CreateEventModal } from "./CreateEventModal";
import { NgoDetailsTab } from "./NgoDetailsTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardContentProps {
  user: any;
  ngo: any;
  events: any[];
}

import { useRouter } from "next/navigation";
// ... imports

export function NgoDashboardContent({ user, ngo, events }: DashboardContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"events" | "details">("events");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Calculate stats
  const totalVolunteers = events.reduce((acc, event) => acc + (event.attendees?.length || 0), 0);
  const totalEvents = events.length;

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-black pb-6 gap-4">
          <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                NGO Dashboard
                <span className="text-base font-normal bg-lime-100 px-3 py-1 rounded-full border border-black text-lime-800">
                    {ngo?.name || "Unverified Organization"}
                </span>
              </h1>
              <p className="text-gray-500 font-bold mt-1">Welcome back, {user?.name}</p>
          </div>
          
          <div className="flex items-center gap-4">
             <Button 
                variant={activeTab === 'events' ? 'default' : 'outline'}
                onClick={() => setActiveTab('events')}
                className={`font-bold border-2 border-black ${activeTab === 'events' ? 'bg-black text-white hover:bg-gray-800' : 'hover:bg-gray-100'}`}
             >
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
             </Button>
             <Button 
                variant={activeTab === 'details' ? 'default' : 'outline'}
                onClick={() => setActiveTab('details')}
                className={`font-bold border-2 border-black ${activeTab === 'details' ? 'bg-black text-white hover:bg-gray-800' : 'hover:bg-gray-100'}`}
             >
                <FileText className="mr-2 h-4 w-4" /> Organization Details
             </Button>
            <Button 
                variant="outline" 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-bold text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        {activeTab === "events" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-lime-50">
                        <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="text-4xl font-black text-black">{totalEvents}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-blue-50">
                        <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Volunteers</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="text-4xl font-black text-black">{totalVolunteers}</div>
                        </CardContent>
                    </Card>
                     <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-purple-50 flex items-center justify-center p-6 cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => setIsCreateModalOpen(true)}>
                        <div className="text-center space-y-2">
                            <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                                <Plus size={24} />
                            </div>
                            <h3 className="font-bold text-lg">Create New Event</h3>
                        </div>
                    </Card>
                </div>

                {/* Events Grid */}
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black">My Events</h2>
                        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-black text-white hover:bg-gray-800 font-bold">
                            <Plus className="mr-2 h-4 w-4" /> Create Event
                        </Button>
                     </div>
                     
                     {events.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-400">No events yet</h3>
                            <p className="text-gray-400 mt-2">Create your first event to get started.</p>
                             <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4" variant="outline">
                                Create Event
                            </Button>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <EventCard key={event._id} event={event} adminMode={true} />
                            ))}
                        </div>
                     )}
                </div>
            </div>
        ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <NgoDetailsTab ngo={ngo} />
            </div>
        )}

        <CreateEventModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
                // Ideally trigger a re-fetch or rely on router.refresh() from the modal
                router.refresh();
            }}
        />
      </div>
    </div>
  );
}
