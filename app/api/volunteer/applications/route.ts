import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "volunteer") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const applications = await Application.find({ userId: (session.user as any).id })
            .populate({
                path: "eventId",
                populate: { path: "ngoId", select: "name logoUrl" } // Nested populate for NGO name
            })
            .sort({ appliedAt: -1 });

        return NextResponse.json({ applications });
    } catch (error: any) {
        console.error("Fetch my applications error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
