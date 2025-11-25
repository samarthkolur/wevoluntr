import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Mock upload process
        // In a real app, upload to S3/Cloudinary here
        const mockUrl = `https://voluntr.com/files/${file.name}-${Date.now()}`;

        return NextResponse.json({ url: mockUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
