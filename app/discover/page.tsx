import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Ngo from "@/models/Ngo";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ location?: string, cause?: string }> }) {
  const { location, cause } = await searchParams;

  await connectDB();

  // const verifiedNgos = await Ngo.find({ verificationStatus: "verified" }).select("_id");
  // const verifiedNgoIds = verifiedNgos.map((ngo) => ngo._id);

  const query: any = {
      // ngoId: { $in: verifiedNgoIds },
      status: "open", // Only show open events
  };

  if (location) {
      query.$or = [
          { location: { $regex: location, $options: "i" } },
          { title: { $regex: location, $options: "i" } }
      ];
  }

  if (cause) {
       const causeQuery = [
           { causes: { $in: [new RegExp(cause, "i")] } },
           { category: { $regex: cause, $options: "i" } }
       ];
       
       if (query.$or) {
           query.$and = [
               { $or: query.$or },
               { $or: causeQuery }
           ];
           delete query.$or;
       } else {
           query.$or = causeQuery;
       }
  }

  // Use lean() for performance and simple object structure
  const events = await Event.find(query)
      .populate("ngoId", "name logoUrl")
      .sort({ date: 1 })
      .lean();

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Header */}
      <div className="bg-lime-50 border-b-2 border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
                <Link href="/dashboard/volunteer" className="p-2 hover:bg-lime-200 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-black tracking-tight">Discover Opportunities</h1>
           </div>
           <form className="hidden md:flex gap-2">
                <input 
                    name="location" 
                    placeholder="Location..." 
                    defaultValue={location}
                    className="border-2 border-black rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
                <input 
                    name="cause" 
                    placeholder="Cause or Category..." 
                    defaultValue={cause}
                    className="border-2 border-black rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
                <Button type="submit" className="bg-black text-white hover:bg-gray-800 font-bold border-2 border-transparent">
                    <Search size={16} />
                </Button>
           </form>
        </div>
        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
             <form className="flex flex-col gap-2">
                <input 
                    name="location" 
                    placeholder="Location..." 
                    defaultValue={location}
                    className="border-2 border-black rounded-lg px-3 py-2 text-sm font-bold w-full"
                />
                 <div className="flex gap-2">
                    <input 
                        name="cause" 
                        placeholder="Cause/Category..." 
                        defaultValue={cause}
                        className="border-2 border-black rounded-lg px-3 py-2 text-sm font-bold w-full"
                    />
                    <Button type="submit" className="bg-black text-white hover:bg-gray-800 font-bold shrink-0">
                        <Search size={16} />
                    </Button>
                 </div>
             </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
         {events.length === 0 ? (
             <div className="text-center py-20">
                 <h2 className="text-2xl font-black text-gray-400">No events found</h2>
                 <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
                 <Link href="/discover">
                    <Button variant="link" className="mt-4 font-bold">Clear Filters</Button>
                 </Link>
             </div>
         ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {events.map((event: any) => (
                     <EventCard key={event._id.toString()} event={{...event, _id: event._id.toString(), ngoId: event.ngoId ? {...event.ngoId, _id: event.ngoId._id.toString()} : null}} />
                 ))}
             </div>
         )}
      </div>
    </div>
  );
}
