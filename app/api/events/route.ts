import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Ngo from "@/models/Ngo";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ngo_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const data = await req.json();

        // Find the NGO associated with this user
        const ngo = await Ngo.findOne({ adminId: session.user.id });
        if (!ngo) {
            return NextResponse.json({ error: "NGO profile not found" }, { status: 404 });
        }

        const event = await Event.create({
            ...data,
            ngoId: ngo._id,
            attendees: [],
        });

        return NextResponse.json({ event }, { status: 201 });
    } catch (error: any) {
        console.error("Create event error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ngo_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const ngo = await Ngo.findOne({ adminId: session.user.id });
        if (!ngo) {
            // If no NGO profile yet, return empty list or specific error?
            // Dashboard handles redirect if not ngo_admin, but maybe they haven't completed onboarding?
            return NextResponse.json({ events: [] });
        }

        const events = await Event.find({ ngoId: ngo._id }).sort({ createdAt: -1 });

        return NextResponse.json({ events });
    } catch (error) {
        console.error("Fetch events error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
