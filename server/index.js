require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { router: authRoutes } = require('./routes/auth');
const productRoutes = require('./routes/products');
const bookingRoutes = require('./routes/bookings');
const socialRoutes = require('./routes/social');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const requestRoutes = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', socialRoutes); // /api/wishlist, /api/messages
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/requests', requestRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`RentMyThing AI Backend Node Server running on http://localhost:${PORT}`);
});
