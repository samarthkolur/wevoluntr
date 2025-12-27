import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const application = await Application.findById(id);

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        if (application.userId.toString() !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (application.status !== 'pending') {
            return NextResponse.json({ error: "Cannot cancel processed application" }, { status: 400 });
        }

        await Application.findByIdAndDelete(id);

        return NextResponse.json({ message: "Application cancelled" });
    } catch (error: any) {
        console.error("Cancel application error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
