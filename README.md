# 📦 NaviLogix - Smart AI-Powered Logistics Management

![NaviLogix Banner](https://img.shields.io/badge/Status-Production--Ready-emerald?style=for-the-badge&logo=rocket)
![Version](https://img.shields.io/badge/Version-3.1.0-blue?style=for-the-badge)
![AI-Powered](https://img.shields.io/badge/AI--Powered-Gemini--3.1--Flash-purple?style=for-the-badge&logo=google-gemini)

> **NaviLogix** is a high-performance, enterprise-grade logistics and parcel tracking ecosystem. Built for speed, transparency, and intelligence, it leverages AI to automate routing and providing instant support while delivering a stunning, glassmorphic user experience.

---

## 🚀 Vision
In a world of complex logistics, NaviLogix simplifies the last mile. From automated rider assignment to real-time financial reporting for COD deliveries, we provide the tools needed for modern delivery businesses to scale effortlessly.

---

## ✨ Key Features & Innovation

### 🤖 Intelligent AI Ecosystem
- **Gemini 3.1 Flash-Lite Integration**: A state-of-the-art floating AI assistant that doesn't just chat—it *understands*. It autonomously detects Tracking IDs in natural language, queries the live MongoDB database, and provides instant status updates.
- **Smart Logistics Guidance**: Real-time help for users regarding delivery windows, service types, and tracking issues.

### 📊 Advanced Administrative Engine
- **Dynamic User Management**: A sophisticated, tabbed interface with a **grid-based sliding panel system** for managing thousands of users.
- **Granular Control**: Shift users between roles (Guest to Regular, Regular to Staff) and assign them to specific branches on the fly.
- **Visual Analytics Dashboard**: Powered by **Chart.js**, offering deep insights:
  - 🏢 **Branch Performance**: Comparative volume analysis.
  - 🚴 **Rider Efficiency**: Tracking assigned vs. delivered performance.
  - 📦 **Status & Type Breakdown**: Real-time Doughnut and Pie charts for system-wide visibility.

### 📍 Precision Mapping & Routing
- **OpenStreetMap & Leaflet Integration**: Solid route visualization with color-coded markers (Origin 🟢, Destination 🔴, Stops 🔵).
- **Rider-Specific Viewports**: Interactive maps designed for delivery personnel to visualize their daily assignments.
- **Smart Auto-Assignment**: Proprietary algorithm ensures parcels are automatically balanced across available riders based on daily capacity limits (MAX_DAILY_DELIVERIES).

### 🎨 Premium User Experience
- **Modern UI Suite**: Features glassmorphism, floating neumorphic components, and smooth **Framer Motion** transitions.
- **Payment Gateways**: Multi-tier subscription model (Free vs. Premium) with a customized **Checkout** experience to unlock advanced COD reports.
- **Live Notifications**: Real-time inbox for branch-to-admin communication and parcel request approvals.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v4, Framer Motion, React-Chartjs-2 |
| **Backend** | Node.js, Express.js (ES6 Modules) |
| **Database** | MongoDB (Atlas) & Mongoose |
| **Security** | JSON Web Tokens (JWT) with HTTP-only Cookies, Bcrypt.js |
| **AI/ML** | Google Generative AI (Gemini 3.1) |
| **Maps** | Leaflet, OpenStreetMap, Nominatim |

---

## 🔐 Role-Based Access Control (RBAC)

NaviLogix implements a strict 5-tier security model:

1.  **Main Admin**: Global oversight, branch registration, user/role management, and master analytics.
2.  **Branch Head**: Manage localized hub operations, staff assignment, and parcel dispatch requests.
3.  **Delivery Personnel (Rider)**: Access assigned maps, update delivery statuses, and track daily goals.
4.  **Premium User**: Unlock COD financial reports, detailed delivery history, and priority tracking.
5.  **Guest User**: Public marketing access (Home, About, Services) and quick-track parcel lookup.

---

## 🏃 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local or Cloud)
- **Gemini API Key** (from Google AI Studio)

### 2. Environment Configuration
Create a `.env` in the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
```

### 3. Installation
```bash
# Clone the repo
git clone https://github.com/lakaThabrew/navilogix.git
cd navilogix

# Install & Seed
cd server; npm install && npm run seed
cd ../client; npm install
```

### 4. Running Logic
```bash
# Backend (from /server)
npm run dev

# Frontend (from /client)
npm run dev
```

---

## 📁 Project Architecture

```
NaviLogix/
├── client/                 # React UI Layer
│   ├── src/components/     # ChatBot, Maps, Radial Menus
│   ├── src/pages/          # Dashboard, AdminReports, Track
│   └── src/utils/          # Centralized Logger & Helpers
├── server/                 # Express API Layer
│   ├── controllers/        # Business Logic & AI Routing
│   ├── models/             # Mongoose Schemas (Parcels, Branches)
│   ├── routes/             # RBAC Protected Endpoints
│   └── config/             # DB & Algorithm Constraints
└── README.md
```

---

## 👤 Author

**Lakmana Thabrew**
- **GitHub**: [@lakaThabrew](https://github.com/lakaThabrew)
- **Work**: Full-Stack Logistics Solutions

---
*Built with ❤️ for the next generation of logistics management.*

