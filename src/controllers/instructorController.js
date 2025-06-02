import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// In-memory OTP store (for demo; use DB/Redis in prod)
const otpStore = {};

// POST /send-email-otp
router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = generateOTP();
  otpStore[email] = otp;

  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: email,
      otp_code: otp,
    },
  };

  try {
    await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload);
    res.status(200).json({ message: 'OTP sent to email successfully' });
  } catch (error) {
    console.error('EmailJS Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to send OTP via email' });
  }
});
