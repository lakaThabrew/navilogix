# 📦 NaviLogix - Smart Parcel Tracking System

> A modern, AI-powered logistics management platform with real-time tracking, intelligent routing, and a clean, modern User Interface.

NaviLogix is a comprehensive parcel tracking and delivery management system designed for efficiency and transparency. It features automated branch assignment, AI-powered chatbot assistance, role-based dashboards, and seamless integration with OpenStreetMap for route optimization.

## ✨ Key Features

- 🎨 **Modern UI**: A stunning, modern interface featuring glassmorphic forms, floating neumorphic elements, smooth Framer Motion animations, and a rich Red, White, and Blue color palette.
- 📱 **Fully Mobile Responsive**: Seamless experience across all devices with responsive navigation, dropdown menus, and scalable map layouts.
- 🔐 **Role-Based Access Control (RBAC)**: 5 distinct user levels with customized access:
  - **Guest Users**: Track parcels immediately via Tracking ID without login.
  - **Regular Users (Premium)**: Personalized dashboard, profile management, and detailed parcel history/reports.
  - **Delivery Personnel**: Daily task lists, OpenStreetMap route optimization, and one-click status updates.
  - **Branch Heads**: View parcel status, receive branch deliveries, and communicate directly with Main Office.
  - **Main Admin**: Full system control, data entry, comprehensive analytics, and user role management.
- 🤖 **AI Integration**:
  - **Gemini Chatbot**: Integrated AI assistant for natural language queries about system usage and parcel routing.
  - **Smart Dispatching**: Automated branch routing and load management.
- 📍 **Real-Time Tracking & Maps**: Live parcel status updates and interactive rider maps powered by Leaflet and OpenStreetMap.
- 💰 **COD & Financials**: Cash-on-delivery tracking, revenue reporting, and user subscription models.
- 📈 **Advanced Analytics**: Interactive Chart.js dashboards offering time-based, type-based, and branch-based statistical insights.
- 📧 **Built-in Inbox System**: Direct intra-system messaging for Branch Heads to request parcel entries from Main Admins.

## 🛠️ Tech Stack

**Frontend:**
- React 18 / Vite
- Tailwind CSS (v4)
- Framer Motion (Animations & floating effects)
- Chart.js & React-Chartjs-2 (Analytics)
- React Leaflet (Mapping & Geocoding)
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js (ES6 Modules)
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcrypt.js (Authentication)
- Google Generative AI (Gemini APIs)

**External APIs:**
- OpenStreetMap / Nominatim (Mapping & Geocoding)
- OSRM (Route optimization)

## 🚀 Installation & Setup

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/lakaThabrew/navilogix.git
cd navilogix
```

### 3. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/navilogix
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Frontend Setup
```bash
cd ../client
npm install
```

### 5. Seed Database
Populate the database with sample branches, users, and parcels:
```bash
cd server
npm run seed
```
**Sample Accounts (Password: `password123`):**
- Admin: `admin@navilogix.com`
- Branch Head: `kamal@example.com`
- Delivery: `sunil@example.com`
- User: `chamara@example.com`

### 6. Run the Application
Start the Backend:
```bash
cd server
npm run dev
```
Start the Frontend (in a new terminal):
```bash
cd client
npm run dev
```
Access the application at `http://localhost:5173`.

## 📁 Project Structure

```
NaviLogix/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, ChatBot, Maps, etc.)
│   │   ├── pages/          # App Views (Dashboard, Inbox, Track, Profile, etc.)
│   │   ├── utils/          # Helper modules (logger.js)
│   │   └── App.jsx         # App routing and layout
│   └── eslint.config.js    # Linting configuration
│
├── server/                 # Node.js REST API
│   ├── config/             # DB connections
│   ├── controllers/        # Route logic (Auth, Parcels)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API Endpoints
│   └── server.js           # Express entry point
│
└── README.md
```

## 🐛 Troubleshooting

- **MongoDB Connection Failed**: Ensure your local MongoDB service is running (`net start MongoDB` on Windows) or check your Atlas connection string.
- **Port Conflicts**: If port `5000` or `5173` is in use, modify the respective `.env` files and `vite.config.js`.
- **Lint Warnings**: The frontend uses an enforced ESLint configuration. Run `npm run lint` inside `/client` to verify code quality.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Lakmana Thabrew**
- GitHub: [@lakaThabrew](https://github.com/lakaThabrew)
- Email: lakmanathabrew123@gmail.com

---
*Built with ❤️ for modern, scalable logistics management.*
