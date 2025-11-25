import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { legalName, phone, dob, location, maxDistanceKm, skills, interests } = body;

        await connectDB();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                role: "volunteer",
                legalName,
                phone,
                dob,
                location,
                maxDistanceKm,
                skills,
                interests,
                isProfileComplete: true,
            },
            { new: true }
        );

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Volunteer onboarding error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
