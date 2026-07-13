const express = require('express');
const router = express.Router();
const { db, saveDatabase } = require('../db');

// In-memory OTP storage for email verification: { email: { otp: "123456", expires: Date.now() + 10min } }
const otpStore = {};

const getUserFromReq = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  return db.users.find((u) => u.id === token || u.email.toLowerCase() === token.toLowerCase()) || null;
};

// Send Email Verification OTP
router.post('/send-otp', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email.toLowerCase()] = {
    otp: generatedOtp,
    expires: Date.now() + 10 * 60 * 1000
  };
  console.log(`[AUTH OTP] Sent verification OTP ${generatedOtp} for email ${email}`);
  res.json({
    success: true,
    message: `Verification code sent to ${email}`,
    devOtpCode: generatedOtp
  });
});

// Verify Email Verification OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP code are required' });
  }
  const record = otpStore[email.toLowerCase()];
  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ error: 'Verification OTP has expired or is invalid. Please request a new code.' });
  }
  if (record.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Incorrect 6-digit OTP code. Please check and try again.' });
  }
  delete otpStore[email.toLowerCase()];
  res.json({ success: true, verified: true });
});

router.post('/login', (req, res) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Student account not found. Please click Create Campus Account to sign up.' });
  }
  res.json({ token: user.id, user });
});

router.post('/register', (req, res) => {
  const { email, name, college, hostel, phone, otpVerified } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }
  let existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({
      error: 'An account with this email address already exists! Please switch to Sign In.'
    });
  }

  const cleanPhone = (phone || '').replace(/[\s\-\+]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  const user = {
    id: `user_${Date.now()}`,
    email: email.toLowerCase(),
    name: name.trim(),
    role: 'STUDENT',
    college: college || 'Campus Student',
    hostel: hostel || 'Hostel Room',
    phone: phone.trim(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    isVerified: true,
    verificationIdType: otpVerified ? 'OTP Verified Student Member' : 'Verified Campus Network Member',
    rating: 5.0,
    completedRentals: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  db.users.push(user);
  saveDatabase(db);
  res.status(201).json({ token: user.id, user });
});

// Google Authentication Endpoint with Profile Completion Detection
router.post('/google', (req, res) => {
  const { email, name, avatar, college, hostel, phone } = req.body;
  if (!email) return res.status(400).json({ error: 'Google email required' });

  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    // Check if details are already filled (not placeholder or empty)
    const hasDetails = user.college &&
      user.phone &&
      user.college !== 'Indian University Campus' &&
      !user.hostel?.includes('Hostel / Residence') &&
      !user.phone?.includes('00000');

    return res.json({
      token: user.id,
      user,
      needsCompletion: !hasDetails
    });
  }

  // First time Google Sign In -> Create initial record & require completion
  user = {
    id: `user_g_${Date.now()}`,
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    role: 'STUDENT',
    college: college || '',
    hostel: hostel || '',
    phone: phone || '',
    avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    isVerified: true,
    verificationIdType: 'Google SSO Verified Student',
    rating: 5.0,
    completedRentals: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  db.users.push(user);
  saveDatabase(db);
  res.json({ token: user.id, user, needsCompletion: true });
});

router.get('/me', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(user);
});

router.put('/profile', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { name, college, hostel, phone } = req.body;
  if (name) user.name = name;
  if (college) user.college = college;
  if (hostel) user.hostel = hostel;
  if (phone) user.phone = phone;
  saveDatabase(db);
  res.json(user);
});

module.exports = { router, getUserFromReq };
