import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEvent extends Document {
    _id: Types.ObjectId;
    ngoId: Types.ObjectId;
    title: string;
    description: string;
    location: string;
    date: Date;
    category: string;
    image: string;
    requiredVolunteers: number;
    skillsRequired: string[];
    attendees: Types.ObjectId[];
    status: "open" | "closed" | "completed";
    causes: string[];
}

const EventSchema: Schema<IEvent> = new Schema(
    {
        ngoId: { type: Schema.Types.ObjectId, ref: "Ngo", required: true },
        title: { type: String, required: true },
        description: { type: String, required: true }, // Added description
        location: { type: String, required: true }, // Added location
        date: { type: Date, required: true }, // Added date
        category: { type: String, required: true }, // Added category (e.g., Environment, Education)
        image: { type: String, required: false }, // Added cover image
        requiredVolunteers: { type: Number, required: true },
        skillsRequired: { type: [String], default: [] }, // Added skills
        attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
        status: {
            type: String,
            enum: ["open", "closed", "completed"],
            default: "open"
        },
        causes: { type: [String], default: [] }, // Added causes tags
    },
    { timestamps: true }
);

const Event: Model<IEvent> =
    (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
