import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Calendar, MapPin, Users, ArrowLeft, Clock, Share2, Tag } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { VolunteerActions } from "@/components/VolunteerActions";

async function getEvent(id: string) {
    await connectDB();
    try {
        const event = await Event.findById(id).populate("ngoId").lean();
        if (!event) return null;
        return JSON.parse(JSON.stringify(event));
    } catch (e) {
        return null;
    }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEvent(id);
    const session = await getServerSession(authOptions);

    if (!event) {
        notFound();
    }

    const ngo = event.ngoId;
    const progress = Math.min(100, ((event.attendees?.length || 0) / event.requiredVolunteers) * 100);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-black pb-20">
             {/* Header / Nav */}
            <div className="bg-white border-b-2 border-black sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/discover">
                        <Button variant="ghost" className="font-bold text-gray-600 hover:text-black hover:bg-gray-100 flex items-center gap-2">
                             <ArrowLeft size={20} /> Back to Discover
                        </Button>
                    </Link>
                    <div className="flex gap-4">
                        <Button variant="outline" size="icon" className="rounded-full border-2 border-black hover:bg-gray-100">
                            <Share2 size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10">
                 {/* Hero Section */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                     <div className="lg:col-span-2 relative h-64 md:h-96 bg-gray-200 rounded-2xl border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group">
                        {event.image ? (
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                                <Users size={48} className="mb-2 opacity-50" />
                                <span className="font-bold text-lg">No Event Image</span>
                            </div>
                        )}
                        <span className="absolute top-4 left-4 bg-lime-400 border-2 border-black px-4 py-1.5 font-black uppercase text-sm tracking-wider rounded-lg shadow-sm">
                            {event.category}
                        </span>
                     </div>

                     {/* Quick Stats Card - Desktop only (mostly) */}
                     <div className="hidden lg:flex flex-col justify-center bg-white border-2 border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                         <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-black leading-tight tracking-tight mb-2">{event.title}</h1>
                                <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                                    <span className={`w-2 h-2 rounded-full ${event.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {event.status === 'open' ? 'Registrations Open' : 'Create Closed'}
                                </div>
                            </div>

                             <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 border border-black rounded-lg">
                                        <Calendar className="text-blue-600 h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase font-bold text-gray-500">Date & Time</p>
                                        <p className="font-bold text-lg">
                                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </p>
                                        <p className="text-sm font-medium text-gray-600">
                                            {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-50 border border-black rounded-lg">
                                        <MapPin className="text-red-500 h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase font-bold text-gray-500">Location</p>
                                        <p className="font-bold text-lg line-clamp-1">{event.location}</p>
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">
                                            View on Map
                                        </a>
                                    </div>
                                </div>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-10">
                         {/* Mobile Title (visible only on small screens) */}
                         <div className="lg:hidden mb-6">
                             <h1 className="text-3xl font-black leading-tight tracking-tight mb-4">{event.title}</h1>
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 font-bold text-gray-700">
                                    <Calendar size={20} /> 
                                    {new Date(event.date).toLocaleString()}
                                </div>
                                <div className="flex items-center gap-3 font-bold text-gray-700">
                                    <MapPin size={20} /> 
                                    {event.location}
                                </div>
                              </div>
                         </div>

                        {/* About Section */}
                        <section className="bg-white border-2 border-black rounded-2xl p-8 shadow-sm">
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <span className="bg-lime-300 w-8 h-8 flex items-center justify-center border border-black rounded-full text-sm">01</span>
                                About the Event
                            </h3>
                            <div className="prose prose-lg text-gray-700 leading-relaxed max-w-none">
                                <p className="whitespace-pre-wrap">{event.description}</p>
                            </div>
                        </section>

                        {/* Skills & Causes */}
                        <section className="bg-white border-2 border-black rounded-2xl p-8 shadow-sm">
                             <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <span className="bg-purple-300 w-8 h-8 flex items-center justify-center border border-black rounded-full text-sm">02</span>
                                Requirements & Tags
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-gray-500 uppercase text-sm mb-3">Skills Required</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {event.skillsRequired && event.skillsRequired.length > 0 ? (
                                            event.skillsRequired.map((skill: string) => (
                                                <span key={skill} className="bg-gray-100 text-gray-800 font-bold px-4 py-2 rounded-lg border border-black text-sm hover:bg-gray-200 transition-colors cursor-default">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic">No specific skills listed</span>
                                        )}
                                    </div>
                                </div>

                                {event.causes && event.causes.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-gray-500 uppercase text-sm mb-3">Related Causes</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {event.causes.map((cause: string) => (
                                                <span key={cause} className="flex items-center gap-1 text-purple-700 font-bold text-sm">
                                                    <Tag size={14} /> #{cause}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        {/* Volunteer Action Card */}
                        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-24">
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2">
                                     <h3 className="text-xl font-black">Volunteer Spots</h3>
                                     <span className="text-sm font-bold bg-lime-100 px-2 py-1 rounded border border-black text-lime-800">
                                         {Math.max(0, event.requiredVolunteers - (event.attendees?.length || 0))} remaining
                                     </span>
                                </div>
                                <div className="w-full bg-gray-100 h-4 rounded-full border border-black overflow-hidden relative">
                                    <div 
                                        className="bg-lime-400 h-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 font-medium text-right">
                                    {event.attendees?.length || 0} signed up of {event.requiredVolunteers} needed
                                </p>
                            </div>

                            {/* Client Component for Actions */}
                            <VolunteerActions event={event} />

                             <p className="text-xs text-center text-gray-500 mt-4 leading-tight">
                                100% verified opportunity. Join 500+ other volunteers making a difference today.
                             </p>
                        </div>

                        {/* Organization Info */}
                        <div className="bg-gray-50 border-2 border-black rounded-2xl p-6">
                            <h4 className="font-bold text-gray-500 uppercase text-xs mb-4">Organized by</h4>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-14 w-14 bg-white rounded-xl border border-black flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                    {ngo?.logoUrl ? (
                                        <img src={ngo.logoUrl} alt={ngo.name} className="h-full w-full object-contain" />
                                    ) : (
                                        <Users className="text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h5 className="font-black text-lg leading-none flex items-center gap-1.5">
                                        {ngo?.name || "Unknown Org"}
                                        {ngo?.verificationStatus === 'verified' && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                                    </h5>
                                    <span className="text-xs font-bold text-gray-500">Verified Organization</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                                {ngo?.description || "This organization has not provided a description."}
                            </p>
                            <Link href={`/discover?cause=${encodeURIComponent(ngo?.name || "")}`}>
                                <Button variant="outline" className="w-full bg-white font-bold border-2 border-black hover:bg-gray-100">
                                    View Organization Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                 </div>
            </main>
        </div>
    );
}
