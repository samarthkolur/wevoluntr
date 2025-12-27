import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import Event from "@/models/Event";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: eventId } = await params;
        await connectDB();

        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Check if already applied
        const existing = await Application.findOne({
            eventId,
            userId: (session.user as any).id,
        });

        if (existing) {
            return NextResponse.json(
                { error: "You have already applied for this event" },
                { status: 400 }
            );
        }

        const application = await Application.create({
            eventId,
            userId: (session.user as any).id,
            ngoId: event.ngoId,
            status: "pending",
        });

        return NextResponse.json({ application }, { status: 201 });
    } catch (error: any) {
        console.error("Apply error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: eventId } = await params;
        await connectDB();

        // Check application status for the logged-in user
        const application = await Application.findOne({
            eventId,
            userId: (session.user as any).id
        });

        return NextResponse.json({ application });
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
