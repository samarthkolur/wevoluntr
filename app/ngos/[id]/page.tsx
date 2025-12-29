import { connectDB } from "@/lib/mongodb";
import Ngo from "@/models/Ngo";
import Event from "@/models/Event";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Building2, Globe, FileText, BadgeCheck, Mail, Calendar } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { notFound } from "next/navigation";

async function getNgoData(id: string) {
  await connectDB();
  
  try {
      const ngo = await Ngo.findById(id).lean();
      if (!ngo) return null;
      
      const events = await Event.find({ ngoId: id, status: "open" })
        .sort({ date: 1 })
        .lean();

      return { 
          ngo: JSON.parse(JSON.stringify(ngo)), 
          events: JSON.parse(JSON.stringify(events)) 
      };
  } catch (e) {
      console.error("Error fetching NGO data:", e);
      return null;
  }
}

export default async function NgoDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getNgoData(id);

  if (!data) {
    notFound();
  }

  const { ngo, events } = data;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Header */}
      <div className="bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
                <Link href="/ngos" className="p-2 hover:bg-gray-100 rounded-full transition-colors border-2 border-transparent hover:border-black">
                    <ArrowLeft size={24} />
                </Link>
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black tracking-tight line-clamp-1">{ngo.name}</h1>
                    {ngo.verificationStatus === "verified" && (
                         <BadgeCheck className="text-blue-500 fill-blue-100 w-5 h-5 flex-shrink-0" />
                    )}
                </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {/* NGO Profile Header */}
          <div className="border-2 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
              <div className="h-48 bg-lime-100 border-b-2 border-black relative">
                  {/* Banner content or pattern could go here */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black to-transparent" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)' }}></div>
              </div>
              
              <div className="px-6 pb-8 relative">
                   <div className="absolute -top-16 left-6 md:left-10 h-32 w-32 bg-white border-2 border-black rounded-2xl flex items-center justify-center p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                       {ngo.logoUrl ? (
                           <img src={ngo.logoUrl} alt={ngo.name} className="max-h-full max-w-full object-contain" />
                       ) : (
                           <Building2 className="h-12 w-12 text-gray-300" />
                       )}
                   </div>

                   <div className="pt-20 md:pl-44 space-y-4">
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-black">{ngo.name}</h2>
                                {ngo.registrationNumber && (
                                    <p className="text-gray-500 font-bold mt-1 text-sm bg-gray-100 inline-block px-2 py-1 rounded border border-gray-200">
                                        Reg No: {ngo.registrationNumber}
                                    </p>
                                )}
                            </div>
                            
                            {ngo.regDocsUrl && (
                                <a href={ngo.regDocsUrl} target="_blank" rel="noreferrer">
                                    <Button variant="outline" className="border-2 border-black font-bold flex items-center gap-2 hover:bg-gray-50">
                                        <FileText size={16} /> View Credentials
                                    </Button>
                                </a>
                            )}
                       </div>

                       <p className="text-lg md:text-xl text-gray-700 max-w-4xl leading-relaxed font-medium">
                           {ngo.description}
                       </p>
                   </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Info */}
              <div className="lg:col-span-1 space-y-6">
                   <div className="bg-purple-50 border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-xl mb-4">Contact & Info</h3>
                        <div className="space-y-4">
                            {/* If we had email/website fields they would go here. For now using generic/available ones */}
                            <div className="flex items-center gap-3">
                                <Building2 size={20} className="text-purple-600" />
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Type</p>
                                    <p className="font-bold">Non-Profit Organization</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BadgeCheck size={20} className="text-purple-600" />
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                        {ngo.verificationStatus?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                   </div>
              </div>

              {/* Main Content - Events */}
              <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-black pb-4">
                       <h3 className="text-3xl font-black flex items-center gap-2">
                           <Calendar className="h-8 w-8" /> Active Events
                       </h3>
                       <span className="bg-black text-white px-3 py-1 rounded-full font-bold text-sm">
                           {events.length}
                       </span>
                  </div>

                  {events.length === 0 ? (
                      <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                           <p className="text-xl font-bold text-gray-400">No active events at the moment.</p>
                           <p className="text-gray-400 mt-2">Check back later or follow this NGO for updates.</p>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {events.map((event: any) => (
                              <EventCard key={event._id} event={{...event, ngoId: ngo}} />
                          ))}
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}
