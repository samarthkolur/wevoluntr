"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, FileDown, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Applicant {
    _id: string;
    userId: {
        name: string;
        email: string;
        phone: string;
        location: string;
        image: string;
        skills: string[];
    };
    status: "pending" | "approved" | "rejected";
    appliedAt: string;
}

export default function EventManagePage({ eventId }: { eventId: string }) {
    const [applications, setApplications] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            const res = await fetch(`/api/events/${eventId}/applications`);
            const data = await res.json();
            if (data.applications) {
                setApplications(data.applications);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [eventId]);

    const handleUpdateStatus = async (appId: string, status: "approved" | "rejected") => {
        try {
            const res = await fetch(`/api/events/${eventId}/applications`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId: appId, status })
            });
            if (res.ok) {
                // Optimistic update
                setApplications(apps => apps.map(app => 
                    app._id === appId ? { ...app, status } : app
                ));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDownloadCSV = () => {
        window.open(`/api/events/${eventId}/export`, '_blank');
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    const pendingApps = applications.filter(a => a.status === 'pending');
    const existingApps = applications.filter(a => a.status !== 'pending');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <Link href="/dashboard/ngo" className="flex items-center gap-2 font-bold text-gray-500 hover:text-black">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                     <p className="font-bold text-gray-600">Total Applicants: {applications.length}</p>
                     <Button onClick={handleDownloadCSV} variant="outline" className="border-2 border-black font-bold">
                        <FileDown className="mr-2 h-4 w-4" /> Download CSV
                     </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pending List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-black bg-yellow-100 inline-block px-3 py-1 border-2 border-black rounded-lg">Pending Requests</h2>
                    {pendingApps.length === 0 ? (
                         <div className="text-gray-400 italic font-bold p-4 border-2 border-dashed border-gray-300 rounded-xl">No pending applications</div>
                    ) : (
                        pendingApps.map(app => (
                            <Card key={app._id} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 bg-gray-200 rounded-full border border-black overflow-hidden flex-shrink-0">
                                            {app.userId.image && <img src={app.userId.image} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{app.userId.name}</h3>
                                            <p className="text-xs text-gray-500">{app.userId.location}</p>
                                            <div className="flex flex-wrap gap-1 mt-2 mb-3">
                                                {app.userId.skills?.slice(0, 3).map(s => (
                                                    <span key={s} className="text-[10px] bg-gray-100 border border-black px-1 rounded font-bold">{s}</span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleUpdateStatus(app._id, 'approved')} className="bg-green-500 hover:bg-green-600 text-white border-2 border-black font-bold h-8 flex-1">
                                                    <Check size={14} className="mr-1" /> Approve
                                                </Button>
                                                <Button size="sm" onClick={() => handleUpdateStatus(app._id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold h-8 flex-1">
                                                    <X size={14} className="mr-1" /> Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Approved/Rejected History */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-black bg-gray-100 inline-block px-3 py-1 border-2 border-black rounded-lg">History</h2>
                     {existingApps.length === 0 ? (
                         <div className="text-gray-400 italic font-bold p-4 border-2 border-dashed border-gray-300 rounded-xl">No history yet</div>
                    ) : (
                        existingApps.map(app => (
                            <div key={app._id} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg bg-white opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${app.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className="font-bold">{app.userId.name}</span>
                                </div>
                                <span className={`text-xs font-black px-2 py-0.5 rounded border border-black uppercase ${app.status === 'approved' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                                    {app.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
