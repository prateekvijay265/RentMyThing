const express = require('express');
const router = express.Router();
const { db, saveDatabase } = require('../db');
const { getUserFromReq } = require('./auth');

router.get('/wishlist', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const userWishlistIds = db.wishlist[user.id] || [];
  const items = db.products.filter((p) => userWishlistIds.includes(p.id));
  res.json(items);
});

router.post('/wishlist/toggle', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { productId } = req.body;
  if (!db.wishlist[user.id]) db.wishlist[user.id] = [];
  const idx = db.wishlist[user.id].indexOf(productId);
  if (idx > -1) {
    db.wishlist[user.id].splice(idx, 1);
  } else {
    db.wishlist[user.id].push(productId);
  }
  saveDatabase(db);
  res.json({ success: true, wishlistIds: db.wishlist[user.id] });
});

router.get('/messages', (req, res) => {
  res.json(db.messages);
});

router.post('/messages', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { recipientId, text } = req.body;
  const newMsg = {
    id: `msg_${Date.now()}`,
    senderId: user.id,
    senderName: user.name,
    recipientId,
    text,
    createdAt: new Date().toISOString()
  };
  db.messages.push(newMsg);
  saveDatabase(db);
  res.status(201).json(newMsg);
});

module.exports = router;
