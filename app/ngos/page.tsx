import { connectDB } from "@/lib/mongodb";
import Ngo from "@/models/Ngo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

async function getNgos() {
  await connectDB();
  const ngos = await Ngo.find({ verificationStatus: "verified" }).lean();
  return JSON.parse(JSON.stringify(ngos));
}

export default async function NgosPage() {
  const ngos = await getNgos();

  return (
    <div className="min-h-screen bg-white font-sans text-black">
       {/* Header */}
       <div className="bg-lime-50 border-b-2 border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-lime-200 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-black tracking-tight">Participating NGOs</h1>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
         {ngos.length === 0 ? (
             <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                 <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                 <h2 className="text-2xl font-black text-gray-400">No verified NGOs found</h2>
                 <p className="text-gray-500 mt-2">Check back later for new organizations.</p>
             </div>
         ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {ngos.map((ngo: any) => (
                     <Card key={ngo._id} className="flex flex-col h-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 overflow-hidden bg-white">
                        <div className="h-40 bg-gray-50 relative border-b-2 border-black flex items-center justify-center p-6">
                            {ngo.logoUrl ? (
                                <img src={ngo.logoUrl} alt={ngo.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                                <Building2 className="h-16 w-16 text-gray-300" />
                            )}
                            <div className="absolute top-3 right-3 bg-lime-400 border-2 border-black px-2 py-1 text-xs font-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                VERIFIED
                            </div>
                        </div>
                        
                        <CardHeader className="p-5 pb-2">
                             <h3 className="text-xl font-black leading-tight line-clamp-2">{ngo.name}</h3>
                        </CardHeader>
                        
                        <CardContent className="p-5 pt-2 flex-grow">
                             <p className="text-gray-600 text-sm line-clamp-3">
                                 {ngo.description}
                             </p>
                             
                             <div className="mt-4 flex flex-wrap gap-2">
                                <span className="text-xs font-bold bg-gray-100 border border-black px-2 py-1 rounded">
                                    Reg: {ngo.registrationNumber}
                                </span>
                             </div>
                        </CardContent>
                        
                        <CardFooter className="p-5 border-t-2 border-black bg-gray-50">
                             <Button asChild className="w-full bg-black text-white hover:bg-gray-800 font-bold border-2 border-transparent shadow-none">
                                <Link href={`/ngos/${ngo._id}`}>
                                    View Details
                                </Link>
                             </Button>
                        </CardFooter>
                     </Card>
                 ))}
             </div>
         )}
      </div>
    </div>
  );
}
