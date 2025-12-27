import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Building2, FileText, Fingerprint } from "lucide-react";

export function NgoDetailsTab({ ngo }: { ngo: any }) {
  if (!ngo) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">
        <div className="h-32 bg-lime-100 border-b-2 border-black flex items-center justify-center">
            {/* Cover area, maybe uses logo if no cover */}
        </div>
        <div className="px-6 relative">
             <div className="absolute -top-12 left-6 h-24 w-24 bg-white border-2 border-black rounded-xl overflow-hidden shadow-md flex items-center justify-center">
                {ngo.logoUrl ? (
                    <img src={ngo.logoUrl} alt={ngo.name} className="h-full w-full object-contain" />
                ) : (
                    <Building2 className="h-10 w-10 text-gray-400" />
                )}
             </div>
             <div className="pt-14 pb-4 flex justify-between items-start">
                 <div>
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        {ngo.name}
                        {ngo.verificationStatus === 'verified' && (
                            <BadgeCheck className="text-blue-500 fill-blue-100 h-6 w-6" />
                        )}
                    </h2>
                    <p className="text-gray-500 font-medium">{ngo.description}</p>
                 </div>
                 <div className="px-3 py-1 bg-black text-white font-bold rounded-full text-sm">
                    {ngo.verificationStatus.toUpperCase()}
                 </div>
             </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <CardHeader className="bg-gray-50 border-b-2 border-black py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Registration Details
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Registration Number</label>
                    <p className="font-mono font-medium text-lg">{ngo.registrationNumber}</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">PAN ID</label>
                    <p className="font-mono font-medium text-lg blur-sm hover:blur-none transition-all cursor-pointer" title="Hover to reveal">
                        {ngo.panId}
                    </p>
                </div>
            </CardContent>
          </Card>

           <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <CardHeader className="bg-gray-50 border-b-2 border-black py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Fingerprint className="h-5 w-5" /> Documents
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Registration Document</label>
                    <div className="mt-2">
                         <a 
                           href={ngo.regDocsUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
                        >
                            <FileText size={16} /> View Document
                         </a>
                    </div>
                </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
