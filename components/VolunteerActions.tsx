"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VolunteerActionsProps {
  event: any;
}

export function VolunteerActions({ event }: VolunteerActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | null>(null);

  useEffect(() => {
    if (session) {
      // Check existing application status
      fetch(`/api/events/${event._id}/apply`)
        .then((res) => res.json())
        .then((data) => {
          if (data.application) {
            setStatus(data.application.status);
          }
        });
    }
  }, [session, event._id]);

  const handleApply = async () => {
    if (!session) {
      router.push("/login");
      return; 
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event._id}/apply`, {
        method: "POST",
      });
      const json = await res.json();
      if (res.ok) {
        setStatus("pending");
      } else {
        alert(json.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
      return (
        <Link href="/login">
            <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 border-2 border-black font-black text-xl rounded-xl">
                Login to Volunteer
            </Button>
        </Link>
      );
  }

  if (status === "approved") {
      return (
        <Button disabled className="w-full h-14 bg-green-500 text-white border-2 border-black font-black text-xl rounded-xl opacity-100">
            <CheckCircle className="mr-2" /> Application Approved
        </Button>
      );
  }

  if (status === "pending") {
      return (
        <Button disabled className="w-full h-14 bg-yellow-400 text-black border-2 border-black font-black text-xl rounded-xl opacity-100">
            <Clock className="mr-2" /> Application Pending
        </Button>
      );
  }
    
  if (status === "rejected") {
       return (
        <Button disabled className="w-full h-14 bg-gray-200 text-gray-500 border-2 border-black font-black text-xl rounded-xl opacity-100">
             Start Closed
        </Button>
      );
  }

  // Check if spots available
  const available = Math.max(0, event.requiredVolunteers - (event.attendees?.length || 0));
  if (available <= 0) {
       return (
        <Button disabled className="w-full h-14 bg-gray-300 text-gray-600 border-2 border-black font-black text-xl rounded-xl">
            Event Full
        </Button>
      );
  }

  return (
    <Button
      onClick={handleApply}
      disabled={loading}
      className="w-full h-14 bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] border-2 border-black font-black text-xl shadow-lg transition-all rounded-xl"
    >
      {loading ? <Loader2 className="animate-spin mr-2" /> : "Volunteer Now"}
    </Button>
  );
}
