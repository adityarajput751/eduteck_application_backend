import validator from "validator";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user/userModel.js";
import jwt from "jsonwebtoken";
import Otp from "../models/user/otpModel.js";

dotenv.config();
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();


const sendOtp = async (req, res) => {
    try {
        const { email, first_name, last_name, password, user_type, ...extraFields } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Valid email is required" });
        }

        const invalidKeys = Object.keys(extraFields);
        if (invalidKeys.length > 0) {
            return res.status(400).json({ success: false, message: `Invalid data` });
        }

        const otp = generateOTP(); // e.g. 4-digit or 6-digit string
        const user = await User.findOne({ email });

        // 🔹 Case 1: Only email provided
        if (!first_name && !last_name && !password && !user_type) {
            if (user) {
                // Save OTP in Otp collection
                await Otp.create({ email, otp });

                return res.status(200).json({
                    success: true,
                    message: "OTP has been generated for existing user",
                    otp, // For testing; remove in production
                    user_id: user.id
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "User does not exist. Please provide full registration details."
                });
            }
        }

        // 🔹 Case 2: Full payload provided, but user already exists
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Validate all required fields
        if (!first_name || !last_name || !password || !user_type) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: first_name, last_name, password, or user_type"
            });
        }

        // Create user and generate OTP
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            id: Date.now().toString(),
            first_name,
            last_name,
            email,
            user_type,
            password: hashedPassword,
            is_verified: false,
            created_at: new Date(),
            updated_at: new Date()
        });

        console.log(newUser, 'newUsernewUserv')

        await newUser.save();

        await Otp.create({ email, otp }); // Save OTP

        return res.status(200).json({
            success: true,
            message: "OTP has been generated and new user created",
            otp, // For testing; remove in production
            user_id: newUser.id
        });

    } catch (err) {
        console.error("Error in sendOtp:", err.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.user_type },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // OTP is valid — delete it
        await Otp.deleteOne({ _id: otpRecord._id });

        // Mark user as verified
        user.is_verified = true;
        user.last_login = new Date();
        user.updated_at = new Date();

        const access_token = generateAccessToken(user);
        const refresh_token = generateRefreshToken(user);

        user.access_token = access_token;
        user.refresh_token = refresh_token;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            access_token,
            refresh_token,
            user: {
                id: user.id,
                email: user.email,
                user_type: user.user_type
            }
        });

    } catch (err) {
        console.error("Error in verifyOtp:", err.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export { sendOtp, verifyOtp };
