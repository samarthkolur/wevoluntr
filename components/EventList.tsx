"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  ngoId: {
    name: string;
    logoUrl: string;
  };
  requiredVolunteers: number;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events/discover");
        const data = await res.json();
        if (data.events) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No events found. Be the first to volunteer!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <Card key={event._id} className="hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all border-2 border-black rounded-xl overflow-hidden hover:-translate-y-1 hover:-translate-x-1 bg-white">
          <CardHeader className="pb-3 bg-lime-100 border-b-2 border-black">
            <div className="flex justify-between items-start">
              <div className="bg-white border-2 border-black text-black text-xs font-bold px-2.5 py-1 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {event.ngoId?.name || "NGO"}
              </div>
            </div>
            <CardTitle className="mt-2 text-xl font-bold">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-black" />
              <span>New York, NY (Mock)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-black" />
              <span>{event.requiredVolunteers} Volunteers needed</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-6">
            <Button className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all active:shadow-none active:translate-y-[4px] active:translate-x-[4px]">
              Volunteer Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
