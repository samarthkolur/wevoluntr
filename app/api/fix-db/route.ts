
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();

        // Get the native collection
        const collection = mongoose.connection.collection("events");

        // List indexes before
        const indexesBefore = await collection.indexes();
        console.log("Indexes before:", indexesBefore);

        // Drop all indexes (except _id which cannot be dropped)
        // We specifically want to drop any 'location' index
        try {
            await collection.dropIndexes();
        } catch (e: any) {
            // If no indexes to drop, it might throw
            console.log("Drop indexes result:", e.message);
        }

        // List indexes after
        const indexesAfter = await collection.indexes();

        return NextResponse.json({
            message: "Indexes dropped successfully",
            indexesBefore,
            indexesAfter
        });
    } catch (error: any) {
        console.error("Fix DB error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
