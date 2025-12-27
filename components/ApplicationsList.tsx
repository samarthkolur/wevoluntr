"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, XCircle } from "lucide-react";
import Link from "next/link";


interface Application {
    _id: string;
    eventId: {
        _id: string;
        title: string;
        date: string;
        location: string;
        ngoId: {
            name: string;
            logoUrl: string;
        };
    };
    status: "pending" | "approved" | "rejected";
    appliedAt: string;
}

export function ApplicationsList() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);

    const fetchApplications = async () => {
        try {
            const res = await fetch("/api/volunteer/applications");
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
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this application?")) return;
        setCancelling(id);
        try {
            const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
            if (res.ok) {
                setApplications(apps => apps.filter(a => a._id !== id));
            } else {
                alert("Failed to cancel application");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCancelling(null);
        }
    };

    if (loading) return <div className="py-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    if (applications.length === 0) {
        return (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50">
                <p className="font-bold text-gray-400">You haven't applied to any events yet.</p>
                <Link href="/discover">
                    <Button className="mt-4" variant="outline">Browse Opportunities</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((app) => (
                <Card key={app._id} className="border-2 border-black shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black">{app.eventId.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} /> {new Date(app.eventId.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={14} /> {app.eventId.location}
                                </span>
                                <span>
                                    Organized by {app.eventId.ngoId?.name || "Unknown NGO"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase text-center border border-black ${
                                app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {app.status}
                            </span>
                            
                            {app.status === 'pending' && (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleCancel(app._id)}
                                    disabled={cancelling === app._id}
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                >
                                    {cancelling === app._id ? <Loader2 className="animate-spin h-4 w-4" /> : "Cancel"}
                                </Button>
                            )}
                            
                            <Link href={`/events/${app.eventId._id}`}>
                                <Button size="sm" variant="ghost">View Event</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
