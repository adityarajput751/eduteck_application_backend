// import User from "../models/userModel.js";
import validator from "validator";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user/userModel.js";
dotenv.config();


const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const sendOtp = async (req, res) => {
  try {
    const { email, first_name, last_name, password, user_type } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const otp = generateOTP();
    let user = await User.findOne({ email });

    if (user) {
      // ✅ Email exists — only email was required
      user.access_token = otp;
      user.updated_at = new Date();
      await user.save();

      return res.status(200).json({
        success: true,
        message: "OTP has been generated for existing user",
        otp,
        user_id: user.id
      });
    } else {
      // ❌ Email does not exist — validate additional fields
      if (!first_name || !last_name || !password || !user_type) {
        return res.status(400).json({
          success: false,
          message: "You don't have an account. Please signup."
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        id: Date.now().toString(),
        first_name,
        last_name,
        email,
        user_type,
        password: hashedPassword,
        access_token: otp,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await newUser.save();

      return res.status(200).json({
        success: true,
        message: "OTP has been generated and new user created",
        otp,
        user_id: newUser.id
      });
    }
  } catch (err) {
    console.error("Error in sendOtp:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { sendOtp };
