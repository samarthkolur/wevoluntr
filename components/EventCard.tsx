import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link"; // For future "View Details" link

interface EventCardProps {
  event: any;
  adminMode?: boolean;
}

export function EventCard({ event, adminMode }: EventCardProps) {
  return (
    <Card className="flex flex-col h-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      <div className="h-48 w-full bg-gray-100 relative border-b-2 border-black">
        {event.image ? (
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white border-2 border-black px-3 py-1 text-sm font-bold rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {event.category}
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <h3 className="text-xl font-black leading-tight line-clamp-2">{event.title}</h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow space-y-3">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(event.date).toLocaleDateString(undefined, {
              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            {event.attendees?.length || 0} / {event.requiredVolunteers} Volunteers
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
           {event.skillsRequired?.slice(0, 3).map((skill: string) => (
             <span key={skill} className="bg-lime-100 text-lime-800 text-xs font-bold px-2 py-1 rounded-md border border-black">
               {skill}
             </span>
           ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t-2 border-black bg-gray-50 flex justify-between items-center">
        <span className={`text-xs font-bold px-2 py-1 rounded-full border border-black ${
            event.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
            {event.status.toUpperCase()}
        </span>
        <Link href={adminMode ? `/dashboard/ngo/events/${event._id}` : `/events/${event._id}`}>
            <Button size="sm" variant="ghost" className="font-bold hover:underline p-0">
               {adminMode ? "Manage Applications" : "View Details"} <ArrowRight size={16} className="ml-1" />
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
