import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INgo extends Document {
    _id: Types.ObjectId;
    name: string;
    adminId: Types.ObjectId;
    verificationStatus: "pending" | "verified" | "rejected";
    registrationNumber: string;
    regDocsUrl: string;
    panId: string;
    description: string;
    logoUrl: string;
    galleryUrls: string[];
}

const NgoSchema: Schema<INgo> = new Schema(
    {
        name: { type: String, required: true, unique: true },
        adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        registrationNumber: { type: String, required: true },
        regDocsUrl: { type: String, required: true },
        panId: { type: String, required: true },
        description: { type: String, required: true },
        logoUrl: { type: String, required: true },
        galleryUrls: { type: [String], default: [] },
    },
    { timestamps: true }
);

const Ngo: Model<INgo> =
    (mongoose.models.Ngo as Model<INgo>) || mongoose.model<INgo>("Ngo", NgoSchema);

export default Ngo;
