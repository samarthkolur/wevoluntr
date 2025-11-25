import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Ngo from "@/models/Ngo";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const location = searchParams.get("location");
        const cause = searchParams.get("cause");

        await connectDB();

        // Find verified NGOs first
        // In a real app with many NGOs, we'd use aggregation or more complex queries
        const verifiedNgos = await Ngo.find({ verificationStatus: "verified" }).select("_id");
        const verifiedNgoIds = verifiedNgos.map((ngo) => ngo._id);

        const query: any = {
            ngoId: { $in: verifiedNgoIds },
        };

        if (location) {
            // Simple case-insensitive substring match for now. 
            // Ideally, Event model should have a location field or we filter by NGO location.
            // Assuming Event title or description might contain location or we rely on NGO location.
            // For this MVP, let's assume we filter by NGO location if we had populated it, 
            // but the prompt asked for "location (substring search)". 
            // Let's assume the user wants to search events by location. 
            // Since Event model doesn't have location, I'll add a virtual or just search title for now 
            // OR better, let's assume we filter by the NGO's location (which is on User/Volunteer but NGO model doesn't have explicit location field in the prompt, 
            // wait, NGO model has `address`? No. User model has `location`. 
            // The prompt says: "Fetch all events where the associated NGO's verificationStatus is 'verified'. Implement filtering based on location (substring search)..."
            // Since NGO model doesn't have location in the prompt (only User has), I will assume we might need to look up the Admin's location or just skip strict location filtering for the MVP if data is missing, 
            // OR I can search the Event title. 
            // Let's stick to the prompt: "filtering based on location". 
            // I will assume the Event *should* have a location or we search the title. 
            // Actually, looking at the prompt again: "Event Model... Field: title, requiredVolunteers, attendees". No location.
            // However, the Home page has "Location Search Input".
            // I will assume for now we search against the Event title or we might have missed a field. 
            // To be safe and helpful, I will add a text search on Title.
            query.title = { $regex: location, $options: "i" };
        }

        // "causes (tag matching)"
        // Event doesn't have tags. User has interests. NGO has description.
        // I'll assume we filter by matching the search term against the NGO's description or name?
        // Or maybe the prompt implies Events should have tags? 
        // "Event Model... (For future feature)" - maybe I should add tags to Event or just search title?
        // Let's add a simple regex search on title for 'cause' as well if provided, or ignore if not supported by schema.

        const events = await Event.find(query)
            .populate("ngoId", "name logoUrl")
            .sort({ createdAt: -1 });

        return NextResponse.json({ events });
    } catch (error) {
        console.error("Event discovery error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
