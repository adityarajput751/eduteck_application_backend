import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Custom ID
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, default: null },
  user_type: {
    type: String,
    enum: ["learner", "instructor", "admin"],
    required: true,
  },
  password: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
  profile_image: { type: String, default: null },
  bio: { type: String, default: null },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    enum: ["active", "suspended", "deleted"],
    default: "active",
  },
  social_login: { type: Boolean, default: false },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  access_token: { type: String, required: false },
  refresh_token: { type: String, default: null },
  last_login: { type: Date, default: null },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
