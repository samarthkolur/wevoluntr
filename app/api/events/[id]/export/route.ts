import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";

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

        const applications = await Application.find({ eventId, status: "approved" })
            .populate("userId", "name email phone location")
            .lean();

        // Generate CSV
        const fields = ["Name", "Email", "Phone", "Location", "Applied At"];
        const csvContent = [
            fields.join(","),
            ...applications.map((app: any) => {
                const user = app.userId;
                const row = [
                    `"${user.name || ""}"`,
                    `"${user.email || ""}"`,
                    `"${user.phone || ""}"`,
                    `"${user.location || ""}"`,
                    `"${new Date(app.appliedAt).toLocaleDateString()}"`
                ];
                return row.join(",");
            }),
        ].join("\n");

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="volunteers-${eventId}.csv"`,
            },
        });
    } catch (error: any) {
        console.error("Export error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
