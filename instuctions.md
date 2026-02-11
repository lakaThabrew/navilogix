# 📦 Anti-Gravity Parcel Tracking System - Requirements Specification

## 1. Project Overview

A smart, AI-powered logistics management system designed for efficient parcel routing and delivery. The system features a unique "Anti-Gravity" UI (floating components, sleek shadows) using a Red, White, and Blue color palette. It automates branch mapping and rider assignment using the Gemini API and OpenStreetMap.

---

## 2. Business Requirements (BRS)

- **Revenue Model:** Implement a "Regular User" subscription/access fee model. Users must pay to unlock a personalized dashboard and detailed reporting.
- **Operational Efficiency:** Reduce manual labor by automating parcel-to-branch mapping and rider allocation.
- **Customer Trust:** Provide real-time transparency for guest users and detailed history for regular users.
- **Scalability:** Support multiple branches with localized delivery zones.
- **Centralized Control:** Ensure that data entry (new parcels) is strictly restricted to the Main Office (Super Admin) to maintain data integrity.

---

## 3. Functional Requirements (FRS)

### 3.1 User Roles & Dashboards

- **Guest User:**
  - No login required.
  - Access to a global search bar to track parcel status via Tracking ID.
- **Regular User (Paid):**
  - Personalized dashboard.
  - View status: _In Main Branch, Transmit, In Sub Branch, Out for Delivery, Delivered, Return_.
  - Generate reports: Time period based, Parcel type, Completion status, COD (Cash on Delivery) income/outcome.
- **Delivery Person (Rider):**
  - Daily task list view.
  - OpenStreetMap integration for the shortest delivery path.
  - Status update capability (Delivered/Returned).
  - Daily limit enforcement (Automatic overflow management).
- **Branch Head (Admin Level 2):**
  - Parcel checkout (verify arrival at branch).
  - Send arrival notifications/messages to the Main Admin.
  - _Constraint:_ Restricted from adding new parcels to the system.
- **Main Admin (Super Admin):**
  - Full system control and analytics.
  - Primary data entry for receiving parcels.
  - Manual override for AI-based assignments.

### 3.2 System Intelligence & Logic

- **Auto-Branch Mapping:** When a parcel is added, the system parses the receiver's address and automatically assigns it to the corresponding branch based on stored geofencing/area data.
- **AI Dispatcher (Gemini API):**
  - Assigns parcels to riders based on their current load and proximity.
  - Calculates the shortest route for the day.
  - If a rider's assigned route exceeds a set distance or time limit, the system automatically pushes remaining parcels to the "Next Tour" (next day).
- **AI Chatbot:** Integrated Gemini chatbot for admins and users to query system data or parcel status using natural language.

---

## 4. Technical Requirements (TRS)

### 4.1 Tech Stack

- **Frontend:** React.js (with Framer Motion for the "Anti-Gravity" floating effect).
- **Backend:** Node.js & Express.js.
- **Database:** MongoDB Atlas (preferred) or MySQL (compatible with offline/on-premise setups).
- **AI Integration:** Google Gemini API (Logic & Chat).
- **Maps API:** OpenStreetMap with Nominatim (Geocoding) and OSRM (Routing).

### 4.2 Database Schema (Conceptual)

- **User Schema:** `userId, name, email, role, paymentStatus, branchId`.
- **Branch Schema:** `branchId, branchName, coordinates (lat, lng), assignedAreas[]`.
- **Parcel Schema:** `trackingId, senderInfo, receiverAddress, branchId, riderId, status, weight, type, COD_Amount, tourDate`.
- **Report Schema:** `reportId, userId, dateRange, statsJson`.

### 4.3 UI/UX Specifications

- **Theme:** Google Anti-Gravity.
- **Colors:**
  - Primary: Deep Navy Blue (#001F3F)
  - Secondary: Alert Red (#FF4136)
  - Background: Clean Pearl White (#F8F9FA)
- **Visual Style:** Cards should have soft, deep shadows to appear as if they are floating. Smooth transitions when switching between dashboard tabs.

---

## 5. Integration Points

- **Payment Placeholder:** A modular service class to handle "Regular User" payments (currently a placeholder for future PayHere or Stripe integration).
- **Map Routing:** The system must pull the Branch's `lat/lng` as the start point for all delivery routes.
- **Error Handling:** If the AI assignment fails or an address is ambiguous, the system must flag the parcel for "Manual Admin Review."
