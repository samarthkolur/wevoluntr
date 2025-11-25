import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEvent extends Document {
    _id: Types.ObjectId;
    ngoId: Types.ObjectId;
    title: string;
    requiredVolunteers: number;
    attendees: Types.ObjectId[];
}

const EventSchema: Schema<IEvent> = new Schema(
    {
        ngoId: { type: Schema.Types.ObjectId, ref: "Ngo", required: true },
        title: { type: String, required: true },
        requiredVolunteers: { type: Number, required: true },
        attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const Event: Model<IEvent> =
    (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
