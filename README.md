# 📦 NaviLogix - Smart Parcel Tracking System

> A modern, AI-powered logistics management platform with real-time tracking and intelligent routing

NaviLogix is a comprehensive parcel tracking and delivery management system designed for efficiency and transparency. It features automated branch assignment, AI-powered chatbot assistance, role-based dashboards, and seamless integration with OpenStreetMap for route optimization.

## ✨ Features

- 🎨 **Modern UI**: Neumorphic design with floating elements and smooth animations
- 🔐 **Role-Based Access Control**: 5 user levels with customized dashboards
  - Guest Users: Track parcels without login
  - Regular Users: Personalized dashboard and reporting
  - Delivery Persons: Daily task lists and route optimization
  - Branch Heads: Parcel management and notifications
  - Main Admin: Full system control and analytics
- 📍 **Smart Branch Assignment**: Automatic routing based on delivery address
- 🤖 **AI Chatbot**: Integrated Gemini AI for natural language queries
- 📊 **Real-Time Tracking**: Live parcel status updates with complete history
- 🗺️ **Route Optimization**: OpenStreetMap integration for shortest delivery paths
- 💰 **COD Management**: Cash-on-delivery tracking and income reporting
- 📈 **Analytics & Reports**: Time-based, type-based, and status-based reporting
- 📧 **Contact Form**: Formspree integration for seamless customer inquiries
- 🔗 **Social Sharing**: Radial share menu with multiple social platforms
- 💫 **Interactive Animations**: Framer Motion powered smooth transitions

## 🛠️ Tech Stack

**Frontend:**

- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Axios for API calls
- React Router for navigation
- Formspree for contact form handling
- React Leaflet for maps
- Chart.js for data visualization

**Backend:**

- Node.js with Express.js (ES6 Modules)
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt.js for password hashing

**APIs & Services:**

- OpenStreetMap (Nominatim for geocoding)
- OSRM for route optimization
- Google Gemini AI for chatbot

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/lakaThabreew/navilogix.git
cd navilogix
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/navilogix
JWT_SECRET=your_secret_key_here

# OpenStreetMap Services (Free - No API key needed)
NOMINATIM_URL=https://nominatim.openstreetmap.org
OSRM_URL=https://router.project-osrm.org

# Google Gemini API (Optional - for AI chatbot)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` folder:

```env
# Formspree Configuration
VITE_FORMSPREE_FORM_ID=your_formspree_form_id_here
```

To get your Formspree Form ID:

1. Sign up at [Formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form ID (e.g., `xkovkrob`)
4. Add it to the `.env` file

**Note:** After updating `.env` files, restart the development server for changes to take effect.

### 4. Environment Variables Summary

**Server (.env):**

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NOMINATIM_URL` - OpenStreetMap geocoding service
- `OSRM_URL` - Route optimization service
- `GEMINI_API_KEY` - Google Gemini API key for chatbot

**Client (.env):**

- `VITE_FORMSPREE_FORM_ID` - Formspree form ID for contact form

### 5. Database Setup

**Option A: Local MongoDB**

Ensure MongoDB is running:

```bash
# Windows (Run as Administrator)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas** (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get connection string
3. Update `MONGO_URI` in `.env` with your Atlas connection string

### 6. Seed Sample Data

Populate the database with sample data (3 branches, 8 users, 5 parcels):

```bash
cd server
npm run seed
```

**Sample credentials (all passwords: `password123`):**

- Admin: `admin@navilogix.com`
- Branch Head: `kamal@example.com`
- Delivery Person: `sunil@example.com`
- Regular User: `chamara@example.com`

### 7. Run the Application

**Start Backend Server:**

```bash
cd server
npm run dev
```

Server runs on: `http://localhost:5000`

**Start Frontend (in new terminal):**

```bash
cd client
npm run dev
```

Client runs on: `http://localhost:5173`

## 🎯 Key Components

### RadialShareMenu

An interactive social sharing component with animated icons:

- Circular radial menu with 8 social platforms
- Smooth spring animations
- Hover effects and responsive design
- Integrated on Contact page

### Contact Form

Formspree-powered contact form with:

- Real-time validation using ValidationError components
- Field-specific error messages
- Loading states during submission
- Success confirmation messages
- Environment-based configuration

### AI Chatbot Integration

- Accessible from any page via floating button
- Can be triggered from Contact page's "Consult with AI" button
- Natural language processing via Google Gemini API
- Real-time parcel tracking queries
- Persistent chat history during session

### Navigation Features

- Services page "Get Started Now" button → Login page
- Services page "Contact Sales" button → Contact page
- Contact page "Consult with AI" button → Opens AI Chatbot
- Smooth route transitions with Framer Motion

## 📱 Usage

### Guest Access

- Visit `http://localhost:5173`
- Use the search bar to track parcels by tracking ID
- Try: `NL2026001`, `NL2026002`, `NL2026003`

### User Login

1. Navigate to `/login`
2. Use sample credentials above
3. Access role-based dashboard

### Create New Account

1. Navigate to `/register`
2. Fill in details and select role
3. Regular users will be prompted for payment setup

### Contact & Support

1. Navigate to `/contact` or click "Contact Sales" on the Services page
2. Fill out the contact form with your inquiry
3. Click "Consult with AI" to open the AI chatbot for instant help
4. Use the radial share menu to connect on social platforms
5. Form submissions are handled via Formspree and sent to your configured email

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Parcels

- `POST /api/parcels` - Create new parcel
- `GET /api/parcels` - Get all parcels
- `GET /api/parcels/track/:trackingId` - Track specific parcel
- `PUT /api/parcels/:id/status` - Update parcel status
- `POST /api/parcels/assign` - Assign rider to parcel

## 📁 Project Structure

```
NaviLogix/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/    # Reusable components
│   │   │   ├── ChatBot.jsx
│   │   │   ├── DeliveryMap.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── RadialShareMenu.jsx  # Social share menu
│   │   ├── pages/         # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Track.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Contact.jsx        # Contact form with Formspree
│   │   │   ├── Inbox.jsx
│   │   │   └── AdminReports.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env              # Environment variables
│   ├── .env.example      # Environment template
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                # Node.js backend
│   ├── config/
│   │   ├── db.js         # MongoDB connection
│   │   └── constants.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── parcelController.js
│   │   ├── messageController.js
│   │   └── aiController.js  # AI chatbot logic
│   ├── models/
│   │   ├── User.js
│   │   ├── Parcel.js
│   │   ├── Branch.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── parcelRoutes.js
│   │   ├── messageRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── server.js
│   ├── seedData.js
│   └── package.json
│
├── .gitignore
├── README.md
└── instructions.md
```

## 🔧 Development

### Available Scripts

**Server:**

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

**Client:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

**MongoDB Connection Failed:**

- Ensure MongoDB is running: `net start MongoDB` (Windows) or `sudo systemctl start mongod` (Linux)
- Check connection string in `.env`

**Port Already in Use:**

- Change `PORT` in server `.env` file
- Update API URLs in client code accordingly

**CORS Issues:**

- Ensure backend CORS is configured correctly
- Check that both servers are running

**Contact Form Not Working:**

- Verify `VITE_FORMSPREE_FORM_ID` is set in `client/.env`
- Restart the development server after adding environment variables
- Ensure you have a valid Formspree account and form ID

**Icons Not Displaying:**

- Ensure `lucide-react` is installed: `npm install lucide-react`
- Clear browser cache and restart dev server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Your Name

- GitHub: [Lakmana Thabrew](https://github.com/lakaThabrew)
- Email: lakmanathabrew123@gmail.com

## 🙏 Acknowledgments

- OpenStreetMap for free mapping services
- MongoDB for database solutions
- React and Node.js communities
- Google Gemini AI for chatbot capabilities
- Formspree for contact form handling
- Lucide for beautiful icon library
- Framer Motion for animation framework

## 📞 Support

For support, email lakmanathabrew123@gmail.com or open an issue in the repository.

---

**Made with ❤️ for efficient logistics management**
