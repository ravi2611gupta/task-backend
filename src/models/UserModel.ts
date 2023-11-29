import mongoose from "mongoose";


export interface IUser extends mongoose.Document {
  name?: string;
  email: string;
  password: string;
  phone?: string;
  mobile: string;
  zipCode: string;
  profilePic?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      type?: string;
      coordinates:[number];
    };
  }
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    mobile: { type: String, required: true },
    zipCode: { type: String, required: true },
    profilePic: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
      }
    }
  },
  {
    timestamps: true,
  }
);

// userSchema.index({ "address.coordinates": "2dsphere" });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
