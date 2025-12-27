import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import Event from "@/models/Event";
import User from "@/models/User";

// Get all applications for an event (NGO Admin only)
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ngo_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: eventId } = await params;
        await connectDB();

        const applications = await Application.find({ eventId })
            .populate("userId", "name email image location phone skills") // Populate user details
            .sort({ appliedAt: -1 });

        return NextResponse.json({ applications });
    } catch (error: any) {
        console.error("Fetch applications error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Update application status
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ngo_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: eventId } = await params; // Note: We actually need applicationId, not eventId for PATCH logic usually, 
        // but let's assume the client sends { applicationId, status } in the body for THIS route event/[id]/applications
        // OR simpler: make a separate route /api/applications/[appId].
        // Let's stick to this as the collection resource.

        const { applicationId, status } = await req.json();

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        await connectDB();

        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // If approved, add to event attendees list as well for easy counting
        if (status === 'approved') {
            await Event.findByIdAndUpdate(eventId, {
                $addToSet: { attendees: application.userId }
            });
        } else if (status === 'rejected') {
            await Event.findByIdAndUpdate(eventId, {
                $pull: { attendees: application.userId }
            });
        }

        return NextResponse.json({ application });
    } catch (error: any) {
        console.error("Update application error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
