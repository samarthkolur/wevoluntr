import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  image?: string;
  provider?: string;
  role: "volunteer" | "ngo_admin";
  isProfileComplete: boolean;
  // Volunteer Fields
  legalName?: string;
  phone?: string;
  dob?: Date;
  location?: string;
  maxDistanceKm?: number;
  skills?: string[];
  interests?: string[];
  // NGO Admin Fields
  ngoId?: Types.ObjectId;
  contactName?: string;
  contactDesignation?: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    image: { type: String },
    provider: { type: String },
    role: { type: String, enum: ["volunteer", "ngo_admin"], default: "volunteer" },
    isProfileComplete: { type: Boolean, default: false },

    // Volunteer Fields
    legalName: { type: String },
    phone: { type: String },
    dob: { type: Date },
    location: { type: String },
    maxDistanceKm: { type: Number },
    skills: { type: [String] },
    interests: { type: [String] },

    // NGO Admin Fields
    ngoId: { type: Schema.Types.ObjectId, ref: "Ngo" },
    contactName: { type: String },
    contactDesignation: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;
