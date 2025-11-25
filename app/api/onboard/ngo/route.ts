import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Ngo from "@/models/Ngo";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            ngoName,
            registrationNumber,
            regDocsUrl,
            panId,
            description,
            logoUrl,
            galleryUrls,
            contactName,
            contactDesignation,
        } = body;

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create NGO
        const newNgo = await Ngo.create({
            name: ngoName,
            adminId: user._id,
            verificationStatus: "pending",
            registrationNumber,
            regDocsUrl,
            panId,
            description,
            logoUrl,
            galleryUrls,
        });

        // Update User
        user.role = "ngo_admin";
        user.ngoId = newNgo._id;
        user.contactName = contactName;
        user.contactDesignation = contactDesignation;
        user.isProfileComplete = true;
        await user.save();

        return NextResponse.json({ success: true, ngo: newNgo });
    } catch (error) {
        console.error("NGO onboarding error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
