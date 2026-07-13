# 🎓 RentMyThing India
### Verified Peer-to-Peer Campus Gear Rental — IIT · BITS · IIM

> Borrow cameras, laptops, cycles, projectors and more from verified students on your campus. Pay in ₹ INR. No middlemen. AI-protected.

**Live App:** https://rentmything-x6pb.onrender.com
**GitHub:** https://github.com/prateekvijay265/RentMyThing

---

## 📸 What is RentMyThing?

RentMyThing is a full-stack campus marketplace where verified Indian university students can rent out and borrow gear from each other — safely, affordably, and with AI-powered fraud protection.

Built for the Indian student ecosystem: ₹ INR pricing, .ac.in email verification, campus hostel location tags, and OTP-secured handovers.

---

## 🚀 Features

### 🏠 Explore & Browse
- **Homepage** — Browse featured gear listings from campuses across India
- **Search Gear** — Full-text search + category filters + price range slider + sort by price/rating
- **NLP Search Bar** — Type natural language like camera under ₹500 for 3 days near hostel and the system auto-parses category, price, and duration
- **Live Map** — See gear available near you on an interactive Leaflet campus map

### 🛒 Listing & Booking
- **List Gear** — Post your item with photos, category, price per day, campus/hostel location
- **Book Gear** — Select rental dates, see total price, confirm booking in one click
- **OTP Handover** — Secure 4-digit pickup and return codes generated per booking to verify in-person handover

### 💬 Student Chat
- **Verified Peer Chat** — Open a direct chat with any listing owner from the product detail page or your dashboard bookings
- **Live polling** — Messages refresh automatically every 4 seconds
- **Context-aware header** — Shows item name being discussed

### 🛡️ AI Safety Center (Google Gemini)
- **Neural Fraud Shield** — Every listing can be scanned for price gouging, advance payment scams, and suspicious descriptions
- **Verify by Name** — Type any gear name (e.g. Sony, MacBook) in the AI Safety Center and matching live listings appear — click to instantly auto-fill and scan
- **Scan from Listing** — Every product detail page has a Run AI Fraud and Safety Audit button that pre-loads the listing and runs the scan automatically
- **Risk Score** — Returns risk level (LOW / MEDIUM / HIGH), specific flags, price comparison vs campus medians, and safety recommendations

### 👤 User Dashboard
- **My Gear Listings** — Manage all items you have listed
- **My Rentals & Borrowed** — View active bookings, enter OTP codes, open student chat per booking
- **Saved Wishlist** — Heart any item to save it; view all wishlisted gear
- **Campus ID & Verification** — Update your college, hostel, phone number

### 🔐 Authentication
- **Email OTP Login** — Enter .ac.in or any email, receive OTP, verify to log in
- **Mobile OTP** — Optional phone verification via Fast2SMS
- **Google Sign-In** — One-click Google login with campus profile completion step
- **JWT Sessions** — Secure token stored in localStorage

### 📋 Demand Hub
- **Post Gear Requests** — Can't find what you need? Post a request with budget and pickup date
- **Make Offers** — Other students can submit offers on open requests

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Vanilla CSS |
| Backend | Node.js, Express 5 |
| Database | JSON flat-file (rentmything_store.json) |
| Maps | Leaflet.js |
| AI Fraud Detection | Google Gemini 2.5 Flash API |
| Email OTP | Nodemailer (SMTP) |
| Mobile OTP | Fast2SMS API |
| Auth | JWT + Google Sign-In (GSI) |
| Hosting | Render (unified full-stack deployment) |
| Icons | Lucide React |
| Fonts | Inter + Fraunces (Google Fonts) |

---

## 📂 Project Structure

`
rentmything/
├── public/
│   └── logo.svg                    # Vector brand emblem
├── src/
│   ├── App.jsx                     # Root router and global state
│   ├── api.js                      # All API client methods
│   └── components/
│       ├── Navbar.jsx
│       ├── HomePage.jsx
│       ├── SearchPage.jsx
│       ├── ProductDetail.jsx
│       ├── Dashboard.jsx
│       ├── AuthModal.jsx
│       ├── ChatModal.jsx
│       ├── ListingModal.jsx
│       ├── LogoIcon.jsx
│       ├── AdminPanel.jsx
│       ├── Footer.jsx
│       ├── ai/
│       │   ├── AIFraudCenter.jsx
│       │   ├── FraudAlert.jsx
│       │   └── NLPSearchBar.jsx
│       ├── map/
│       │   └── CampusMap.jsx
│       └── marketplace/
│           └── RequestsPage.jsx
├── server/
│   ├── index.js                    # Express server entry point
│   ├── db.js                       # JSON database helpers
│   ├── rentmything_store.json      # Persistent database
│   └── routes/
│       ├── auth.js
│       ├── products.js
│       ├── bookings.js
│       ├── social.js               # Wishlist + Chat messages
│       ├── requests.js
│       ├── ai.js                   # Gemini fraud detection
│       └── admin.js
├── index.html
├── vite.config.js
└── package.json
`

---

## ⚙️ Environment Variables

Set these in Render Dashboard → Environment (or a local .env file):

| Variable | Required | Description |
|---|---|---|
| GEMINI_API_KEY | Yes | Google Gemini API key for AI fraud detection |
| JWT_SECRET | Yes | Secret string for signing JWT tokens |
| EMAIL_USER | Optional | Gmail address for sending email OTPs |
| EMAIL_PASS | Optional | Gmail App Password |
| FAST2SMS_API_KEY | Optional | Fast2SMS key for mobile OTP delivery |
| GOOGLE_CLIENT_ID | Optional | Google OAuth Client ID for Google Sign-In |

---

## 🖥️ Running Locally

### Prerequisites
- Node.js 18+
- npm 9+

### Steps

`ash
# 1. Clone the repo
git clone https://github.com/prateekvijay265/RentMyThing.git
cd RentMyThing

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server && npm install && cd ..

# 4. Create .env file
echo GEMINI_API_KEY=your_key_here > .env
echo JWT_SECRET=your_secret_here >> .env

# 5. Start backend
node server/index.js

# 6. Start frontend dev server (in a second terminal)
npm run dev
`

Frontend: http://localhost:5173
Backend API: http://localhost:3001

> Vite proxies /api requests to port 3001 automatically.

---

## 🚀 Deploying to Render

| Setting | Value |
|---|---|
| Build Command | npm install && npm run build && cd server && npm install |
| Start Command | node server/index.js |
| Root Directory | (leave blank) |

The Express server automatically serves the React frontend from /dist.

### Push and Deploy

Double-click PUSH_TO_GITHUB.bat in the project folder, then in Render: Manual Deploy → Deploy latest commit.

Or manually:

`ash
git add .
git commit -m describe your change
git push origin main
`

---

## 🔑 How Key Features Work

### AI Fraud Detection Flow
1. User clicks Run AI Fraud and Safety Audit on any listing
2. Listing data sent to POST /api/ai/analyze-listing
3. Server calls Google Gemini 2.5 Flash with a structured prompt
4. Gemini returns: riskScore (1-10), riskLevel, flags, priceAnalysis, recommendations
5. Frontend renders colour-coded audit result card

### OTP Handover Flow
1. Booking confirmed → 4-digit pickupCode + returnCode generated and stored
2. Renter enters pickupCode at meetup → status becomes ACTIVE
3. Renter enters returnCode on return → status becomes COMPLETED

### Chat Flow
1. User opens chat from listing or dashboard booking
2. GET /api/messages?peerId=xxx fetches conversation history
3. Messages poll every 4 seconds automatically
4. POST /api/messages { recipientId, text } sends new messages

### Authentication Flow
1. Email entered → POST /api/auth/send-otp → OTP sent via Nodemailer
2. OTP verified → POST /api/auth/verify-otp → JWT token issued
3. Token stored in localStorage and sent as Bearer header on all authenticated requests

---

## 🌐 API Reference

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/send-otp | No | Send email OTP |
| POST | /api/auth/verify-otp | No | Verify OTP, get JWT token |
| POST | /api/auth/login | No | Login by email |
| POST | /api/auth/google | No | Google OAuth login |
| GET | /api/auth/me | Yes | Get current user |
| PUT | /api/auth/profile | Yes | Update profile |
| GET | /api/products | No | List/search products |
| POST | /api/products | Yes | Create new listing |
| GET | /api/products/:id | No | Get single product |
| POST | /api/bookings | Yes | Create booking |
| GET | /api/bookings/my-rentals | Yes | Get user bookings |
| POST | /api/bookings/:id/pickup | Yes | Confirm pickup OTP |
| POST | /api/bookings/:id/return | Yes | Confirm return OTP |
| GET | /api/wishlist | Yes | Get wishlist |
| POST | /api/wishlist/toggle | Yes | Add/remove wishlist item |
| GET | /api/messages | No | Get chat messages |
| POST | /api/messages | No | Send message |
| POST | /api/ai/analyze-listing | No | Run Gemini fraud analysis |
| GET | /api/requests | No | Get gear requests |
| POST | /api/requests | Yes | Post a gear request |
| POST | /api/requests/:id/offer | Yes | Submit offer on request |
| GET | /api/admin/stats | No | Admin stats |
| GET | /api/health | No | Server health check |

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built with ❤️ for the Indian student community · IIT Delhi · IIT Bombay · BITS Pilani · IIM Ahmedabad*
