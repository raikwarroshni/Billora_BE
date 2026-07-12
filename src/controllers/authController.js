const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const OTP_TTL_MS = 5 * 60 * 1000;

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
}

// POST /api/auth/send-otp  { phone }
const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    res.status(400);
    throw new Error('A valid 10-digit phone number is required');
  }

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

  await User.findOneAndUpdate(
    { phone },
    { phone, otp, otpExpiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // No SMS provider configured yet — log so it's usable in local dev.
  console.log(`[OTP] ${phone} -> ${otp} (expires in 5 min)`);

  res.json({ message: 'OTP sent', phone, otp, expiresInSeconds: OTP_TTL_MS / 1000 });
});

// POST /api/auth/verify-otp  { phone, otp }
const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    res.status(400);
    throw new Error('Phone and OTP are required');
  }

  const user = await User.findOne({ phone });
  if (!user || !user.otp || !user.otpExpiresAt) {
    res.status(400);
    throw new Error('No OTP was requested for this phone number');
  }
  if (user.otpExpiresAt < new Date()) {
    res.status(400);
    throw new Error('OTP has expired, please request a new one');
  }
  if (user.otp !== otp) {
    res.status(400);
    throw new Error('Incorrect OTP');
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = signToken(user._id);
  res.json({ token, phone: user.phone });
});

module.exports = { sendOtp, verifyOtp };
