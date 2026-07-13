const express = require('express');
const router = express.Router();
const { db, saveDatabase } = require('../db');

const getUserFromReq = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  return db.users.find((u) => u.id === token || u.email.toLowerCase() === token.toLowerCase()) || null;
};

router.post('/login', (req, res) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Student email not registered on network' });
  }
  res.json({ token: user.id, user });
});

router.post('/register', (req, res) => {
  const { email, name, college, hostel, phone } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    return res.json({ token: user.id, user });
  }
  user = {
    id: `user_${Date.now()}`,
    email,
    name,
    role: 'STUDENT',
    college: college || 'IIT Delhi - Hauz Khas Campus',
    hostel: hostel || 'Karakoram Hostel',
    phone: phone || '+91 98000 00000',
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
    isVerified: true,
    verificationIdType: 'Verified College Network Member',
    rating: 5.0,
    completedRentals: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  db.users.push(user);
  saveDatabase(db);
  res.status(201).json({ token: user.id, user });
});

// Continue with Google Authentication Endpoint
router.post('/google', (req, res) => {
  const { email, name, avatar } = req.body;
  if (!email) return res.status(400).json({ error: 'Google email required' });

  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: `user_g_${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role: 'STUDENT',
      college: email.endsWith('.ac.in') || email.endsWith('.edu.in') ? 'Verified Indian Institute Domain' : 'IIT Delhi - Hauz Khas Campus',
      hostel: 'Hostel Block A',
      phone: '+91 98111 22334',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      verificationIdType: 'Google SSO Institutional Verified',
      rating: 5.0,
      completedRentals: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    db.users.push(user);
    saveDatabase(db);
  }
  res.json({ token: user.id, user });
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

router.post('/verify-student', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  user.isVerified = true;
  user.verificationIdType = req.body.idType || 'Aadhaar / Smart Student Identity Verified';
  saveDatabase(db);
  res.json({ success: true, user });
});

module.exports = { router, getUserFromReq };
