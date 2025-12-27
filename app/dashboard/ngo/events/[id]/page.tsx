import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EventManageContent from "@/components/EventManageContent";

export default async function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || (session.user as any).role !== "ngo_admin") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-white p-8">
             <div className="max-w-5xl mx-auto">
                 <div className="mb-8 border-b-2 border-black pb-4">
                     <h1 className="text-4xl font-black">Manage Applications</h1>
                 </div>
                 <EventManageContent eventId={id} />
             </div>
        </div>
    );
}
