
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Ngo from "@/models/Ngo";
import Event from "@/models/Event";

export async function GET() {
    try {
        await connectDB();

        // 1. Create a demo NGO Admin
        const ngoAdminEmail = "demo_ngo@voluntr.com";
        let ngoAdmin = await User.findOne({ email: ngoAdminEmail });

        if (!ngoAdmin) {
            ngoAdmin = await User.create({
                email: ngoAdminEmail,
                name: "Eco Warriors Admin",
                role: "ngo_admin",
                isProfileComplete: true,
                provider: "credentials",
            });
        }

        // 2. Create an NGO Profile
        let ngo = await Ngo.findOne({ adminId: ngoAdmin._id });
        if (!ngo) {
            ngo = await Ngo.create({
                name: "Eco Warriors Foundation",
                adminId: ngoAdmin._id,
                verificationStatus: "verified",
                registrationNumber: "REG-2024-ECO",
                regDocsUrl: "https://example.com/docs",
                panId: "ABCDE1234F",
                description: "Dedicated to preserving our planet through community action and awareness.",
                logoUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=EcoWarriors", // Placeholder
            });
        }

        // 3. Create another NGO
        const ngoAdmin2Email = "food_for_all@voluntr.com";
        let ngoAdmin2 = await User.findOne({ email: ngoAdmin2Email });
        if (!ngoAdmin2) {
            ngoAdmin2 = await User.create({
                email: ngoAdmin2Email,
                name: "Food For All Admin",
                role: "ngo_admin",
                isProfileComplete: true,
                provider: "credentials",
            });
        }

        let ngo2 = await Ngo.findOne({ adminId: ngoAdmin2._id });
        if (!ngo2) {
            ngo2 = await Ngo.create({
                name: "Food For All",
                adminId: ngoAdmin2._id,
                verificationStatus: "verified",
                registrationNumber: "REG-2024-FOOD",
                regDocsUrl: "https://example.com/docs",
                panId: "FGHIJ5678K",
                description: "Fighting hunger one meal at a time in local communities.",
                logoUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=FoodForAll",
            });
        }

        // 4. Create Events
        const eventCount = await Event.countDocuments();
        if (eventCount < 5) {
            await Event.create([
                {
                    ngoId: ngo._id,
                    title: "City Park Cleanup Drive",
                    description: "Join us for a morning of cleaning up our beloved city park. Gloves and bags provided!",
                    location: "Central Park, Downtown",
                    date: new Date(Date.now() + 86400000 * 3), // 3 days from now
                    category: "Environment",
                    image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    requiredVolunteers: 50,
                    skillsRequired: ["General", "Gardening"],
                    status: "open",
                    causes: ["Environment", "Community"],
                },
                {
                    ngoId: ngo._id,
                    title: "Tree Plantation Drive",
                    description: "Help us plant 500 saplings to green our city.",
                    location: "Riverside Walkway",
                    date: new Date(Date.now() + 86400000 * 10),
                    category: "Environment",
                    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    requiredVolunteers: 100,
                    skillsRequired: ["Gardening", "Digging"],
                    status: "open",
                    causes: ["Climate Change"],
                },
                {
                    ngoId: ngo2._id,
                    title: "Weekend Food Distribution",
                    description: "Pack and distribute meals to homeless shelters.",
                    location: "Community Center, Block A",
                    date: new Date(Date.now() + 86400000 * 2),
                    category: "Community",
                    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    requiredVolunteers: 20,
                    skillsRequired: ["Packing", "Driving"],
                    status: "open",
                    causes: ["Hunger", "Poverty"],
                },
                {
                    ngoId: ngo2._id,
                    title: "Charity Tech Support Night",
                    description: "Help seniors learn how to use smartphones and computers.",
                    location: "Senior Living Home, Westside",
                    date: new Date(Date.now() + 86400000 * 7),
                    category: "Education",
                    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    requiredVolunteers: 10,
                    skillsRequired: ["Teaching", "Tech Support"],
                    status: "open",
                    causes: ["Education", "Elderly Care"],
                }
            ]);
        }

        return NextResponse.json({ message: "Database seeded successfully" });
    } catch (error: any) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
