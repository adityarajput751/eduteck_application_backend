router.post('/verify-email-otp', (req, res) => {
  const {
    email,
    otp
  } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.status(200).json({
      message: 'OTP verified successfully'
    });
  }
  res.status(400).json({
    message: 'Invalid or expired OTP'
  });
});