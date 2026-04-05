# 📦 NaviLogix - Smart Parcel Tracking System

> A modern, AI-powered logistics management platform with real-time tracking, intelligent routing, and a clean, modern User Interface.

NaviLogix is a comprehensive parcel tracking and delivery management system designed for efficiency and transparency. It features automated branch assignment, AI-powered chatbot assistance, role-based dashboards, robust reporting analytics, and seamless integration with OpenStreetMap for route optimization.

## ✨ Key Features

- 🎨 **Modern UI & UX**: A stunning, modern interface featuring glassmorphic forms, floating neumorphic elements, smooth Framer Motion animations, interactive radial share menus, password strength meters, and a rich Red, White, and Blue color palette.
- 📱 **Fully Mobile Responsive**: Seamless experience across all devices with responsive navigation, dropdown menus, and scalable map layouts.
- 🔐 **Comprehensive Role-Based Access Control (RBAC)**: 5 distinct user levels with highly customized and protected access:
  - **Guest Users**: Access beautifully designed public marketing pages (Home, About, Services, Contact) and track parcels immediately via Tracking ID without login.
  - **Regular Users (Free & Premium)**: Register to manage deliveries. Features a **Payment Gate** unlocking a personalized dashboard, COD financial reports, and detailed parcel history upon premium upgrade.
  - **Delivery Personnel (Riders)**: Interactive rider maps powered by OpenStreetMap, showing assigned parcels, and one-click status updates (Delivered / Returned).
  - **Branch Heads**: Manage localized branch hubs. Request parcel entries via an integrated Inbox system, receive incoming parcels at the branch, and automatically trigger the **Smart Rider Auto-Assignment Algorithm**.
  - **Main Admin**: Full system control. Register branches, manage staff users on the fly, approve parcel requests, and access comprehensive system-wide analytics.
- 🤖 **AI Integration**:
  - **Gemini 3.1 Chatbot**: A powerful, floating AI assistant powered by the latest **Gemini 3.1 Flash-Lite** models. It autonomously parses user queries, detects Tracking IDs, and fetches real-time parcel status directly from the database to provide instant logistics guidance.
- ⚙️ **Smart Delivery Automation**:
  - **Auto-Assignment Algorithm**: Parcels entering a sub-branch automatically distribute to available riders based on daily capacity limits ensuring balanced workloads.
- 📍 **Interactive Route Visualization**: 
  - **Advanced Maps**: Powered by Leaflet and OpenStreetMap, featuring solid route lines and color-coded markers (🟢 Origin, 🔴 Destination, 🔵 Intermediate Stops).
  - **Visual Status Badges**: Real-time parcel status visualization with intuitive color-coded badges: 🟢 Delivered, 🔴 Returned, 🟠 Out for Delivery, and 🟡 Pending.
- 📊 **Advanced Analytics & Financials**: Interactive Chart.js dashboards offering time-based, parcel-type, and branch-based statistical insights along with Cash-on-Delivery (COD) revenue tracking.
- 📧 **Built-in Inbox & Notifications**: Direct intra-system messaging for Branch Heads to securely request new parcel dispatches from the Main Admin for approval.
- ✉️ **Live Contact Forms**: Integrated Formspree endpoint for real-world customer support requests.

## 🛠️ Tech Stack

**Frontend:**
- **Core**: React 18, Vite
- **Styling**: Tailwind CSS (v4)
- **Animations**: Framer Motion
- **Analytics**: Chart.js & React-Chartjs-2
- **Mapping**: React Leaflet (OpenStreetMap / Nominatim)
- **Icons & Extras**: Lucide React

**Backend:**
- **Runtime**: Node.js & Express.js (ES6 Modules)
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcrypt.js
- **AI Integration**: Google Generative AI (Gemini APIs)
- **Messaging**: Integrated MongoDB-based inbox structure

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
Create a `.env` file in the `client` directory for contact form submissions:
```env
VITE_FORMSPREE_FORM_ID=your_formspree_id_here
```

### 5. Seed Database
Populate the database with sample branches, users, and parcels:
```bash
cd server
npm run seed
```
**Sample Accounts (Password: `password123`):**
- **Admin**: `admin@navilogix.com` (Main Admin)
- **Branch Head**: `kamal@example.com` (Kandy Branch)
- **Delivery**: `sunil@example.com` (Main Office)
- **Regular User**: `chamara@example.com`

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
│   │   ├── components/     # Reusable UI (Navbar, ChatBot, Map, RadialShareMenu, etc.)
│   │   ├── pages/          # App Views (Dashboard, Inbox, Track, Profile, About, Contact, etc.)
│   │   ├── utils/          # Helper modules (logger.js)
│   │   └── App.jsx         # App routing and layout
│   └── eslint.config.js    # Linting configuration
│
├── server/                 # Node.js REST API
│   ├── config/             # DB connections and Constants (e.g., MAX_DAILY_DELIVERIES)
│   ├── controllers/        # Route logic (Auth, Parcels, Messages, AI)
│   ├── models/             # Mongoose schemas (User, Parcel, Branch, Message)
│   ├── routes/             # API Endpoints
│   └── server.js           # Express entry point
│
└── README.md
```

## 🐛 Troubleshooting

- **MongoDB Connection Failed**: Ensure your local MongoDB service is running (`net start MongoDB` on Windows) or check your Atlas connection string.
- **Port Conflicts**: If port `5000` or `5173` is in use, modify the respective `.env` files and `vite.config.js`.
- **Chatbot Not Responding**: Verify your `GEMINI_API_KEY` in the server environment variables.
- **Contact Form Failing**: Ensure `VITE_FORMSPREE_FORM_ID` is set correctly in your client `.env`.
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
