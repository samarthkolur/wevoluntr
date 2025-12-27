import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IApplication extends Document {
    _id: Types.ObjectId;
    eventId: Types.ObjectId;
    userId: Types.ObjectId;
    ngoId: Types.ObjectId;
    status: "pending" | "approved" | "rejected";
    appliedAt: Date;
}

const ApplicationSchema: Schema<IApplication> = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        ngoId: { type: Schema.Types.ObjectId, ref: "Ngo", required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        appliedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Application: Model<IApplication> =
    (mongoose.models.Application as Model<IApplication>) ||
    mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
