# 🌟 RentMyThing India · AI-Powered Campus Peer-to-Peer Rental Marketplace

> **RentMyThing** is an AI-powered campus peer-to-peer rental marketplace that enables verified students to rent and lend everyday essentials securely within their college community. Featuring smart recommendations, AI-driven fraud detection, demand-based matching, campus maps, and intelligent rental bundles, the platform transforms idle assets into affordable, sustainable resources while building a trusted campus sharing ecosystem across India (IIT, BITS, IIM & DU).

---

## ✨ Core Highlights & Features

- 🛡️ **AI-Driven Fraud & Price Gouging Detection:** Powered by Google Gemini (`gemini-2.5-flash`) + dual algorithmic benchmarks to detect suspiciously underpriced gear or deposit scams in real time.
- 🗺️ **Interactive Campus Live Map:** High-contrast interactive Leaflet GPS map with Indian campus presets (IIT Delhi, IIT Bombay, BITS Pilani, IIM Bangalore) and custom ₹ price markers.
- ⚡ **Native Google Chrome Account Sign-In:** Integrated with official Google Identity Services OAuth Token Client (`initTokenClient`) so students can sign in instantly using their real Chrome Google accounts (`@iitd.ac.in`, `@iitb.ac.in`, etc.).
- 📦 **Intelligent Rental Bundles & AI Recommendations:** Smart bundle creator (e.g. *Filmmaker Kit*, *Exam All-Nighter*, *Weekend Trek Pack*) with automatic INR bundle discounts.
- 📣 **Campus Demand Hub:** Peer-to-peer request bounty board where students can post wanted gear items with reward budgets.
- 🤝 **4-Digit Handover Verification & Peer Chat:** Secure OTP verification at hostel room handover and live verified campus peer messaging.
- 🎨 **100% Light Editorial Professional UI:** Crafted with editorial serif typography (`Fraunces` + `Inter`), warm ivory card elevations, smooth micro-animations, and vibrant coral accents.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 + Vite + Vanilla CSS Editorial Design System + Lucide Icons
- **Mapping:** Leaflet + OpenStreetMap Interactive Canvas
- **Backend API:** Node.js + Express REST API
- **AI Engine:** Google Generative AI (`gemini-2.5-flash`) + Indian Campus Algorithmic Fallback Engine
- **Authentication:** Google Identity Services (OAuth2 Token Client v2) + Institutional Campus Email Verification
- **Storage:** Lightweight SQLite / In-Memory Persisted Campus State

---

## 🚀 Quickstart (Local Development)

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment (`.env`):**
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3001
   ```

3. **Run Full-Stack Dev Environment:**
   Start the API server:
   ```bash
   npm run server
   ```
   Start the frontend app:
   ```bash
   npm run dev
   ```

Open your browser at **`http://localhost:5173`** to explore the marketplace.

---

## 🌐 Production Deployment (Free)

- **Frontend:** Easily deployable to **Vercel** (`npm run build`).
- **Backend API:** Easily deployable to **Render.com** or **Fly.io** as a Node.js web service.

---

*Built with ❤️ for Indian Campus Students.*
