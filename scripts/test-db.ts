import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testConnection() {
    console.log("Testing MongoDB Connection...");

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI is missing in .env");
        return;
    }

    console.log("URI found (masked):", uri.replace(/:([^:@]+)@/, ":****@"));

    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("✅ Successfully connected to MongoDB!");
        await client.close();
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
    }

    console.log("\nChecking other env vars:");
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "MISSING");
    console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "SET" : "MISSING");
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "SET" : "MISSING");
    console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING");
}

testConnection();
