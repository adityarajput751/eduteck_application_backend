import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 } // Expires in 60 seconds
});

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default Otp;