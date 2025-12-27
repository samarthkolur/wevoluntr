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
        // const verifiedNgos = await Ngo.find({ verificationStatus: "verified" }).select("_id");
        // const verifiedNgoIds = verifiedNgos.map((ngo) => ngo._id);

        const query: any = {
            // ngoId: { $in: verifiedNgoIds },
        };

        if (location) {
            query.$or = [
                { location: { $regex: location, $options: "i" } },
                { title: { $regex: location, $options: "i" } }
            ];
        }

        if (cause) {
            query.$or = [
                // Add to existing $or if needed, or use $and
                { causes: { $in: [new RegExp(cause, "i")] } },
                { category: { $regex: cause, $options: "i" } }
            ];
            // Merging query.$or is tricky if location set it too.
            // Let's use $and if both are present to avoid overwriting
            if (location) {
                // If location exists, we have query.$or already.
                // We need to wrap them in $and
                delete query.$or;
                query.$and = [
                    { $or: [{ location: { $regex: location, $options: "i" } }, { title: { $regex: location, $options: "i" } }] },
                    { $or: [{ causes: { $in: [new RegExp(cause, "i")] } }, { category: { $regex: cause, $options: "i" } }] }
                ];
            } else {
                query.$or = [
                    { causes: { $in: [new RegExp(cause, "i")] } },
                    { category: { $regex: cause, $options: "i" } }
                ];
            }
        }

        const events = await Event.find(query)
            .populate("ngoId", "name logoUrl")
            .sort({ date: 1 }); // Sort by upcoming date

        return NextResponse.json({ events });
    } catch (error) {
        console.error("Event discovery error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
