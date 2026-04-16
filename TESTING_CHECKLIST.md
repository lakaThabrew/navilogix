# NaviLogix - Comprehensive QA Testing Checklist

This checklist contains all the features, functions, and buttons you need to test in the NaviLogix platform, separated by User Roles and specific pages.

---

## 1. General & Public Pages

### 1.1 Navigation Bar (`Navbar.jsx`)

- [x] **Logo**: Clicks redirect to Home page with smooth hover animation
- [x] **Desktop Menu**: All navigation links work correctly
- [x] **Mobile Menu**:
  - [x] Hamburger menu icon toggles open/close properly
  - [x] Mobile menu slides in/out with animation
  - [x] Clicking any link closes the mobile menu
- [x] **Role-Based Navigation**:
  - [x] Guest users see: About, Services, Contact, Login, Register
  - [x] Regular users see: About, Services, Contact, Dashboard, Profile
  - [x] Admin/Staff see: Dashboard, Profile (+ Inbox/Reports for main admin, Branch Reports for branch head)
  - [x] About, Services, Contact hidden for admin/delivery/branch head roles
- [x] **Login/Register Buttons** (when logged out):
  - [x] Login button navigates to `/login`
  - [x] Register button navigates to `/register` with hover animations
- [x] **Logout Button** (when logged in):
  - [x] Clears localStorage and redirects to `/login`
  - [x] Gradient button with proper hover effects

### 1.2 Home Page (`Home.jsx`)

- [x] Hero section animations load smoothly
- [x] Track & Trace Search Bar:
  - [x] Accepts tracking ID input
  - [x] Clicking "Track" navigates to tracking page
  - [x] Shows validation for empty input
- [x] "Get Started" button navigates to register page
- [x] All floating card animations work properly
- [x] Background gradient orbs animate smoothly

### 1.3 About Page (`About.jsx`)

- [x] Leaflet Map loads correctly without broken icons
- [x] Branch markers display on map with proper pins
- [x] Clicking branch markers shows popup with branch details:
  - [x] Branch name
  - [x] Branch phone Number
  - [x] Service Areas
- [x] "From Idea to Global Impact" section displays with proper styling
- [x] All team/mission content is visible
- [x] Mobile responsive layout works correctly

### 1.4 Services Page (`Services.jsx`)

- [x] Three pricing tiers display correctly (Free, Plus, Pro)
- [x] Each package shows:
  - [x] Package name and pricing
  - [x] Feature list with checkmarks
  - [x] Proper hover animations on cards
- [x] **Action Buttons**:
  - [x] Free Package → "Get Started" navigates to `/register`
  - [x] Plus Package → "Buy Plus" navigates to `/dashboard`
  - [x] Pro Package → "Contact Sales" navigates to `/contact`
- [x] Mobile responsive grid layout works

### 1.5 Contact Page (`Contact.jsx`)

- [x] **Contact Form (Formspree Integration)**:
  - [x] Form validates all required fields (Name, Email, Subject, Message)
  - [x] Email field validates proper email format
  - [x] Submit button shows loading state "Sending..."
  - [x] Success message displays after submission
  - [x] Form clears after successful submission
  - [x] Formspree API key is configured correctly
  - [x] ValidationError components display properly for errors
- [x] **Contact Information Cards** display:
  - [x] Headquarters address (with line break)
  - [x] Phone numbers
  - [x] Email support address
  - [x] Business hours
  - [x] All cards have hover animations
- [x] **Premium Support Section**:
  - [x] "Consult with AI" button triggers chatbot to open
  - [x] Background animations and gradients work
- [x] **RadialShareMenu Component**:
  - [x] Auto-opens after 1 second on page load
  - [x] Toggle button opens/closes radial menu
  - [x] All 7 social icons display correctly:
    - [x] WhatsApp (0°) - Opens whatsapp link
    - [x] Facebook (51.4°) - Opens facebook link
    - [x] Email (102.8°) - Opens mailto link
    - [x] Instagram (154.2°) - Opens instagram link
    - [x] Web (205.6°) - Opens navilogix.com
    - [x] GitHub (257°) - Opens github link
    - [x] Twitter (308.4°) - Opens twitter link
  - [x] Each icon has correct color and hover tooltip
  - [x] Clicking icons opens correct external links
  - [x] Mobile responsiveness (smaller radius on mobile)

### 1.6 Tracking Page (`Track.jsx` - `/track/:id`)

- [x] Entering valid Tracking ID shows:
  - [x] Parcel status with color-coded badge
  - [x] Sender information (name, address, contact)
  - [x] Receiver information (name, address, contact)
  - [x] Parcel details (weight, type, COD amount)
  - [x] Complete timeline/history with status updates
  - [x] Branch information if assigned
  - [x] Delivery date if applicable
- [x] Entering invalid Tracking ID shows:
  - [x] "Parcel not found" error message
  - [x] User-friendly error styling
- [x] Status badge colors correct:
  - [x] Delivered = green
  - [ ] Returned = red
  - [x] Out for Delivery = orange
  - [x] In the branch = blue
  - [x] Pending = Yellow
- [x] Mobile responsive layout
- [x] Timeline animations work smoothly

### 1.7 AI Chatbot Component (`ChatBot.jsx`)

- [x] **Floating Chat Button**:
  - [x] Visible on all pages at bottom right
  - [x] Opens/closes chat window on click
  - [x] Proper z-index (above other elements)
- [ ] **Chat Window**:
  - [x] Displays welcome message from bot
  - [x] User messages align right (blue background)
  - [x] Bot messages align left (white background)
  - [x] "..." loading indicator shows while waiting for response
  - [x] Input field accepts text
  - [x] Enter key sends message
  - [x] Send button sends message
  - [x] auto Scroll to bottom on new messages
- [x] **AI Integration**:
  - [x] Sends message to `/api/ai/chat` endpoint
  - [x] Receives response from Gemini AI
  - [x] Shows error message if API fails
  - [x] Chatbot can answer parcel-related queries
- [x] **Event Listener**:
  - [x] Works from Contact page "Consult with AI" button
- [x] Mobile responsive (full width minus padding)

### 1.8 Footer Component (`Footer.jsx`)

- [x] Logo displays correctly and connect this to Home Page
- [x] Social media icons (Facebook, Twitter, LinkedIn) work with hover effects
- [x] Social meida icons connects to external links
- [x] Quick Links section shows all navigation links
- [x] Contact information displays properly
- [x] Copyright year is current
- [x] All links navigate correctly
- [x] Mobile responsive columns

---
---

## 2. Authentication & Profile

### 2.1 Auth Component (`Auth.jsx` - Unified Login/Register/Forgot/Reset)

#### **Mode: Login (`/login`)**

- [x] **Visual Panel** (left side on desktop):
  - [x] "Welcome Back!" heading with gradient text
  - [x] Description text displays correctly
  - [x] Lock emoji (🔐) displays
  - [x] Background animations work
  - [x] Pattern overlay visible
- [x] **Form Panel** (right side):
  - [x] Logo displays and has hover scale effect
  - [x] Toggle switch "LOGIN" is highlighted
  - [x] Email field:
    - [x] Required field validation
    - [x] Email format validation
    - [x] Placeholder text shows
  - [x] Password field:
    - [x] Required field validation
    - [x] Show/hide password toggle (Eye icon) works
    - [x] Password masks as bullets when hidden
  - [x] "Forgot Password?" link navigates to `/forgot-password`
  - [x] "SIGN IN" button:
    - [x] Shows "Signing in..." when loading
    - [x] Disables during submission
    - [x] Successful login stores token in localStorage
    - [x] Redirects to `/dashboard` after success
    - [x] Shows error alert for invalid credentials

#### **Mode: Register (`/register`)**

- [x] **Visual Panel**:
  - [x] "Join the Fleet" heading displays
  - [x] Rocket emoji (🚀) displays
  - [x] Description text shows
- [x] **Toggle Switch**: "REGISTER" is highlighted
- [x] **Form Fields**:
  - [x] Full Name field (required)
  - [x] Email field (required, email validation)
  - [x] Password field with show/hide toggle
  - [x] **Password Strength Meter**:
    - [x] Shows when typing password
    - [x] Displays score label (Empty/Weak/Fair/Good/Strong, Excellent)
    - [x] Progress bar fills based on strength
    - [x] Colors change (gray/red/orange/blue/green)
    - [x] Criteria: length, uppercase, numbers, special chars
- [x] **Payment Prompt** (for regular users):
  - [x] Confirms "Proceed to setup payment?"
  - [x] Clicking "Yes" redirects to checkout page
  - [x] Clicking "No" stops registration
  - [x] store the reversation in database
  - [x] Canceling stops registration
  - [x] Check the reservation staus in profile
   -[x] check the button on remainder is working.
- [x] **Create Account Button**:
  - [x] Shows "Creating..." when loading
  - [x] Creates user account successfully
  - [x] Stores token in localStorage
  - [x] Redirects to `/dashboard`
  - [x] Shows error alert if registration failsx
#### **Mode: Forgot Password (`/forgot-password`)**

- [x] **Visual Panel**:
  - [x] "Recover Access" heading
  - [x] Email emoji (📧) displays
- [x] **Form**:
  - [x] Recovery Email field (required)
  - [x] "Send Token" button works
  - [x] Shows "Sending..." during submission
  - [x] Success alert shows after token sent
  - [x] Switches to "reset" mode after success
  - [x] "Back to Login" button returns to login
- [x] **Backend**: Check server console for reset token

#### **Subscription & Checkout Flow (`Checkout.jsx`)**:

- [x] **Plan Selection**:
  - [x] Navigating from Services/Dashboard carries correct plan name in URL
  - [x] Correct package details display (Plus vs Pro)
  - [x] Selecting a package highlights it with a blue border
- [x] **Maintenance Mode**:
  - [x] "Payment Gateway: Under Maintenance" alert displays
  - [x] User is informed about the Reservation process
- [x] **Reservation Logic**:
  - [x] "Reserve & Pay Later" button works
  - [x] Shows "Reserving..." loading state
  - [x] Successfully calls `/api/auth/reserve` endpoint
  - [x] Stores `isPlanReserved: true` in localStorage
  - [x] Redirects to Profile after successful reservation
- [x] **Error Handling**:
  - [x] Shows error if reservation fails
  - [x] Prevents duplicate reservations if already pending

#### **Mode: Reset Password (internal mode)**

- [x] **Visual Panel**:
  - [x] "Secure Account" heading
  - [x] Shield emoji (🛡️) displays
- [x] **Form**:
  - [x] Reset Token field (required)
  - [x] New Password field with show/hide toggle
  - [x] Confirm Password field with show/hide toggle
  - [x] Validates passwords match
  - [x] Shows error if passwords don't match
  - [x] "Update Password" button:
    - [x] Shows "Resetting..." when loading
    - [x] Successfully resets password
    - [x] Shows success alert
    - [x] Returns to login mode
    - [x] Shows error if token invalid/expired

#### **General Auth Features**:

- [x] Mobile responsive layout
- [x] Form animations (slide in/out) work
- [x] Background decorative elements animate
- [x] All inputs have proper focus states
- [x] Buttons have hover/tap animations
- [x] URL syncs with mode (`/login`, `/register`, `/forgot-password`)

### 2.2 Profile Page (`Profile.jsx`)

- [x] **User Information Display**:
  - [x] Name displays correctly
  - [x] Email displays correctly
  - [x] Role displays correctly
  - [x] Branch displays (if branch_head or delivery_person)
  - [x] Payment status shows (if regular user)
- [x] **Subscription Reminder (Pending Payment)**:
  - [x] Yellow alert box shows if plan is reserved but unpaid
  - [x] Shows "Subscription Pending: [Plan Name]"
  - [x] "Retry Payment" button navigates back to checkout
  - [x] "Payment Gateway: Maintenance" badge visible
- [x] **Update Name**:
  - [x] Input field pre-filled with current name
  - [x] Can modify name
  - [x] "Update Name" button works
  - [x] Success message shows
  - [x] Name updates across entire app (Navbar, Dashboard, etc.)
- [x] **Update Email**:
  - [x] Input field pre-filled with current email
  - [x] Validates email format
  - [x] "Update Email" button works
  - [x] Success message shows
  - [x] Requires re-login with new email
- [x] **Update Password**:
  - [x] Password visibility eye toggle works for both fields
  - [x] Password strength indicator (score + bar + label) works
  - [x] New password field (required)
  - [x] Confirm new password field (required)
  - [x] Validates passwords match
  - [x] Successfully updates password
  - [x] Requires re-login with new password
- [x] Mobile responsive form layout
- [x] All buttons have loading states

---

## 3. Role: Main Admin (`main_admin`)

### 3.1 Navigation Access

- [x] Can access: Home, Dashboard, Inbox, Reports, Profile, logout
- [x] Cannot see: About, Services, Contact (hidden for admin)
- [x] Navbar shows "Inbox" and "Reports" links

### 3.2 Dashboard (`/dashboard`)

#### **Statistics Cards**

- [x] Total Parcels count displays correctly
- [x] Delivered count (green card)
- [x] Returned count (red card)
- [x] Total COD Revenue displays

#### **Notifications/Messages Section**

- [x] Notification bell icon visible
- [x] Unread message count badge shows
- [x] Clicking notification area marks messages as read
- [x] Messages from Branch Heads display:
  - [x] Sender name
  - [x] Message content
  - [x] Timestamp
  - [x] "Approve" button (if parcel request)
- [x] Clicking "Approve" creates parcel from request
- [x] Success alert after approval

#### **Add New Parcel Form** (Main Office)

- [x] Form visible to main_admin
- [x] **Sender Information**:
  - [x] Name field (required)
  - [x] Address field (required)
  - [x] Contact field (required - validates 10 digits)
- [x] **Receiver Information**:
  - [x] Name field (required)
  - [x] Address field (required)
  - [x] Contact field (required - validates 10 digits)
- [x] **Parcel Details**:
  - [x] Weight field (validates non-negative)
  - [x] Type dropdown (Standard, Document, Parcel)
  - [x] COD Amount field (validates non-negative)
- [x] **Submit Button**: "Add Parcel to System"
  - [x] Creates parcel immediately (not a request)
  - [x] Auto-assigns branch based on receiver address
  - [x] Generates unique tracking ID
  - [x] Success alert shows
  - [x] Form clears after submission
  - [x] Parcel appears in table below

#### **Add Branch Form**

- [x] Form appears for main_admin
- [x] Fields: Branch Name, City, Latitude, Longitude
- [x] Required field validation works
- [x] "Add Branch" button creates new branch
- [x] Success alert displays
- [x] Form clears after success
- [x] New branch appears in system (check About page map)

#### **Add Staff User Form**

- [x] Form visible to main_admin
- [x] Fields: Name, Email, Password, Role, Branch (conditional)
- [x] Role dropdown shows:
  - [x] Regular
  - [x] Delivery Person
  - [x] Branch Head
  - [x] Main Admin
- [x] **Branch Selection**:
  - [x] Dropdown appears when "Branch Head" or "Delivery Person" selected
  - [x] Dropdown hidden for "Regular" and "Main Admin"
  - [x] Lists all available branches
- [x] **Create User Button**:
  - [x] Creates user successfully
  - [x] Assigns branch if applicable
  - [x] Success alert shows
  - [x] Form clears
  - [x] New user visible in Reports > User Management

#### **Parcels Overview Table**

- [x] Shows ALL parcels in system (admin has full access)
- [x] **Columns Display**:
  - [x] Tracking ID
  - [x] Receiver Address
  - [x] Branch Name
  - [x] Created Date
  - [x] Status (dropdown for editing)
  - [x] Actions column
- [x] **Status Dropdown** (for each parcel):
  - [x] Can select: Pending, In Main Branch, Transmitting, In Sub Branch
  - [x] **Restrictions**: Cannot directly set to "Out for Delivery" or "Delivered"
  - [x] Changing status updates immediately
  - [x] Status color changes based on selection
  - [x] Updates history timeline
- [x] **Quick Action Buttons**:
  - [x] "Transmit to Branch" appears when status is "In Main Branch"
  - [x] Clicking changes status to "Transmitting"
  - [x] Button shows for parcels with assigned branches
- [x] **Assign Rider Dropdown**:
  - [x] Shows "Assign Rider" dropdown for parcels in "In Sub Branch" status
  - [x] Lists only delivery persons from the parcel's branch
  - [x] Assigning rider shows success message
  - [x] Rider name appears in table after assignment
- [x] Table pagination/scroll works
- [x] Mobile responsive (horizontal scroll)

### 3.3 Inbox Page (`/inbox`)

- [x] Accessible from Navbar "Inbox" link
- [x] Shows current user role in heading
- [x] Displays unread message count badge
- [ ] **Message List**:
  - [x] Unread messages highlighted (blue background, blue dot)
  - [x] Read messages have reduced opacity
  - [x] Each message shows:
    - [x] Sender name
    - [x] Message content
    - [x] Timestamp
    - [x] Read/unread indicator dot
  - [x] Clicking message marks it as read
- [ ] **Approval Flow** (for parcel requests):
  - [x] Messages with parcelData show "Approve" button
  - [x] Clicking "Approve" prompts confirmation
  - [x] Confirming creates parcel in system
  - [x] Success alert displays
  - [x] Message marked as read after approval
  - [x] Error alert if approval fails
- [x] Empty state displays if no messages
- [x] Mobile responsive layout

### 3.4 Reports/Analytics Page (`/reports`)

- [x] Accessible from Navbar "Reports" link
- [x] Page title: "System Analytics"

#### **Date Filter Section**

- [x] Start Date input field
- [x] End Date input field
- [x] "Apply Filter" button:
  - [x] Filters all data by date range
  - [x] Updates all charts and stats
- [x] "Clear" button:
  - [x] Resets dates to empty
  - [x] Shows all-time data again

#### **Key Metrics Cards**

- [x] **Total Parcels** (blue border) - Count of all parcels in date range
- [x] **Total Revenue (COD)** (green border) - Sum of all COD amounts
- [x] **Pending Delivery** (yellow border) - Count of non-delivered/returned
- [x] **Returns** (red border) - Count of returned parcels

#### **Charts Section**

- [x] **Branch Performance** (Bar Chart):
  - [x] X-axis: Branch names
  - [x] Y-axis: Parcel count
  - [x] Shows "No branch data yet" if empty
  - [x] Chart is responsive
- [x] **Rider Efficiency** (Bar Chart):
  - [x] Two bars per rider: Assigned vs Delivered
  - [x] Different colors for each bar
  - [x] Shows rider names
  - [x] Shows "No rider data yet" if empty
- [x] **Parcel Status Breakdown** (Doughnut Chart):
  - [x] Shows all status types with counts in labels
  - [x] Different colors for each status
  - [x] Legend at bottom
  - [x] Centered in card
  - [x] Shows "No status data yet" if empty
- [x] **Parcel Types** (Pie Chart):
  - [x] Shows parcel types (Document, Package, Standard)
  - [x] Counts in labels
  - [x] Legend at bottom
  - [x] Shows "No parcel type data yet" if empty
- [x] All charts resize properly on mobile

#### **User Management Section**

- [x] Section visible only to main_admin
- [x] Heading: "User Management"
- [x] "Add New User" button:
  - [x] Opens in new tab
  - [x] Navigates to `/dashboard`
- [x] **User Management Table**:
  - [x] **Columns**: Name, Email, Current Role, Branch, Actions
  - [x] Lists ALL users in system
  - [x] **Role Dropdown** (for each user):
    - [x] Options: Regular, Delivery Person, Branch Head, Main Admin
    - [x] Changing dropdown updates role immediately
    - [x] Success alert after update
    - [x] Refetches user list
  - [x] **Branch Assignment Dropdown**:
    - [x] Shows only for Branch Head and Delivery Person roles
    - [x] Shows "N/A" for Regular and Main Admin
    - [x] Lists all available branches
    - [x] Selecting branch updates user immediately
  - [x] **Remove Button**:
    - [x] Shows confirmation dialog
    - [x] Deletes user from system
    - [x] Success message after deletion
    - [x] User removed from table
    - [x] Error alert if deletion fails
  - [x] Table hover effects work
  - [x] Horizontal scroll on mobile

---

## 4. Role: Branch Head (`branch_head`)

### 4.1 Navigation Access

- [x] Can access: Home, Dashboard, Profile, logout
- [x] Cannot see: About, Services, Contact, Inbox, Reports
- [x] Navbar simplified for branch head

### 4.2 Dashboard (`/dashboard`)

#### **Statistics Cards**

- [x] Shows stats for ONLY their branch parcels
- [x] Total Parcels (filtered by branch)
- [x] Delivered count (from their branch)
- [x] Returned count (from their branch)
- [x] COD Revenue (from their branch)

#### **Add Parcel Form** (Branch Head Version)

- [x] Form visible to branch head
- [x] Same fields as admin form (Sender Info, Receiver Info, Parcel Details)
- [x] **Submit Button**: "Send Request to Main Admin"
  - [x] Does NOT create parcel directly
  - [x] Sends notification message to Main Admin
  - [x] Message contains parcel data for approval
  - [x] Success alert: "Request Sent to Main Admin!"
  - [x] Form clears after submission
  - [x] Parcel does NOT appear in table until approved

#### **Parcels Overview Table**

- [x] Shows ONLY parcels where:
  - [x] Branch ID matches branch head's branch
  - [x] OR createdBy matches branch head's user ID
- [x] **Status Dropdown**:
  - [x] Can select: Pending, In Main Branch, Transmitting, In Sub Branch
  - [x] **Restriction**: Cannot set to "Delivered" (only riders can)
  - [x] Can set to "Out for Delivery" (unlike admin)
  - [x] Changing status updates parcel
- [x] **Quick Action Buttons**:
  - [x] "Receive at Branch" button shows when status is "Transmitting"
  - [x] Clicking changes status to "In Sub Branch"
  - [x] Success message displays
- [ ] **Auto-Assignment Feature**:
  - [x] When they change status to "In Sub Branch"
  - [x] System automatically assigns an available delivery person from their branch
  - [x] Success message mentions auto-assignment
  - [x] Rider name appears in table
  - [x] **Check Logic**:
    - [x] Assigns rider with least currently assigned parcels
    - [x] Only assigns riders from same branch
    - [x] Respects MAX_DAILY_DELIVERIES constant
- [x] Table only shows branch-relevant parcels

#### **Restrictions**

- [x] Cannot add branches
- [x] Cannot add staff users
- [x] Cannot access system analytics
- [x] Cannot manage other users

---

## 5. Role: Delivery Person / Rider (`delivery_person`)

### 5.1 Navigation Access

- [ ] Can access: Home, Dashboard, Profile
- [ ] Cannot see: About, Services, Contact, Inbox, Reports
- [ ] Simplified navbar

### 5.2 Dashboard (`/dashboard`)

#### **Statistics Cards**

- [x] Shows ONLY their assigned parcels
- [x] Total Parcels (assigned to them)
- [x] Delivered count (they delivered)
- [x] Returned count (they marked as returned)
- [x] COD collected (from their deliveries)

#### **Parcels Overview Table**

- [x] Shows ONLY parcels where `riderId` matches their user ID
- [x] **Status Display**:
  - [x] Status shown as colored badge (NOT dropdown)
  - [x] Cannot change status via dropdown
- [x] **Action Buttons** (per parcel):
  - [x] "Mark Delivered" button:
    - [x] Visible for all non-delivered parcels
    - [x] Clicking updates status to "Delivered"
    - [x] Success message displays
    - [x] Button text changes to "Delivered ✔" after clicking
    - [x] Button becomes disabled after delivered
  - [x] "Mark Returned" button:
    - [x] Always visible
    - [x] Clicking updates status to "Returned"
    - [x] Success message displays
    - [x] Used when delivery unsuccessful
- [x] **Restriction**: Can ONLY set status to "Delivered" or "Returned"
- [x] No other status options visible

#### **Delivery Map Component** (`DeliveryMap.jsx`)

- [ ] Uses Leaflet/OpenStreetMap
- [ ] Shows delivery locations for assigned parcels:
  - [ ] Receiver addresses marked on map
  - [ ] Markers show parcel tracking ID
  - [ ] Popup on click shows parcel details
  - [ ] Different marker colors for different statuses
- [ ] Map centers on delivery locations
- [ ] Zoom controls work
- [ ] Route lines shown between locations (if implemented)
- [ ] Mobile responsive map size

#### **Restrictions**

- [ ] Cannot add parcels
- [ ] Cannot assign riders
- [ ] Cannot access admin features
- [ ] Cannot change status to anything except Delivered/Returned

---

## 6. Role: Regular User (`regular`)

### 6.1 Navigation Access

- [ ] Can access: Home, About, Services, Contact, Dashboard, Profile
- [ ] Cannot see: Inbox, Reports
- [ ] Full marketing pages visible

### 6.2 Dashboard (`/dashboard`)

#### **Payment Gate (if `paymentStatus` is "unpaid")**

- [ ] **Blur Effect**:
  - [ ] All dashboard content is blurred
  - [ ] Content has reduced opacity
  - [ ] Interactions disabled (pointer-events-none)
- [ ] **Payment Modal/Overlay**:
  - [ ] Modal appears prominently
  - [ ] Heading: "Unlock Premium Features"
  - [ ] Description about premium benefits
  - [ ] "Pay Now" button:
    - [ ] Clicking simulates payment
    - [ ] Updates `paymentStatus` to "paid"
    - [ ] Modal disappears
    - [ ] Dashboard unblurs
    - [ ] Content becomes interactive
  - [ ] "Cancel" or close option
- [ ] Payment confirmation message shows after unlock

#### **Dashboard (after payment or if `paymentStatus` is "paid")**

#### **Statistics Cards**

- [ ] Shows "Premium Unlocked" or similar indicator
- [ ] Stats filtered for this user only:
  - [ ] Parcels sent BY this user (senderInfo.contact or name matches)
  - [ ] Parcels received BY this user (receiverInfo.contact or name matches)
- [ ] Cards show:
  - [ ] Total Sent
  - [ ] Total Received
  - [ ] Delivered to/from them
  - [ ] Returned
  - [ ] COD Paid (as receiver)
  - [ ] COD To Receive (as sender)

#### **Performance Reports Section**

- [ ] Section visible after payment
- [ ] **Parcel Volume Card**:
  - [ ] Shows number of parcels sent
  - [ ] Shows number of parcels received
  - [ ] Visual chart/graph (if implemented)
- [ ] **COD Financials Card**:
  - [ ] Shows total COD paid (as receiver)
  - [ ] Shows total COD to receive (as sender)
  - [ ] Color-coded (red for paid, green for receive)

#### **Parcels Overview Table**

- [ ] Shows ONLY parcels where:
  - [ ] User is sender (senderInfo.contact or name matches)
  - [ ] OR user is receiver (receiverInfo.contact or name matches)
- [ ] **Columns**: Tracking ID, Receiver, Branch, Status
- [ ] **Status Display**: Badge only (NOT editable)
- [ ] **No Actions Column**: Regular users cannot change status
- [ ] Clicking tracking ID could navigate to track page

#### **Restrictions**

- [ ] Cannot add parcels
- [ ] Cannot update statuses
- [ ] Cannot assign riders
- [ ] Cannot access admin/management features
- [ ] Cannot see other users' parcels

---

## 7. Edge Cases, Routing & Security

### 7.1 Authentication & Authorization

- [ ] **Protected Routes**:
  - [ ] Accessing `/dashboard` without login redirects to `/login`
  - [ ] Accessing `/profile` without login redirects to `/login`
  - [ ] Accessing `/inbox` without login redirects to `/login`
  - [ ] Accessing `/reports` without login redirects to `/login`
- [ ] **Role-Based Access Control**:
  - [ ] Regular users trying to access `/inbox` or `/reports` should be blocked or redirected
  - [ ] Branch heads trying to access `/reports` should be blocked
  - [ ] Delivery persons trying to access admin features blocked
- [ ] **Token Expiration**:
  - [ ] Expired token forces re-login
  - [ ] Invalid token clears localStorage
  - [ ] Error message shown for invalid/expired sessions

### 7.2 Data Validation

- [ ] **Parcel Form**:
  - [ ] Negative weight rejected (shows alert)
  - [ ] Negative COD amount rejected (shows alert)
  - [ ] Invalid phone numbers (not 10 digits) rejected
  - [ ] Empty required fields show validation errors
  - [ ] Address fields accept long text without breaking layout
- [ ] **User Forms**:
  - [ ] Email format validated (contains @, domain)
  - [ ] Password minimum length enforced (at least 6 characters)
  - [ ] Special characters in names handled
- [ ] **Tracking ID**:
  - [ ] Invalid format shows appropriate error
  - [ ] Non-existent ID shows "Not Found" message
  - [ ] Case-insensitive search works (if implemented)

### 7.3 UI/UX Edge Cases

- [ ] **Long Text Handling**:
  - [ ] Long tracking IDs don't break table layout
  - [ ] Long addresses wrap properly in table cells
  - [ ] Long usernames don't overflow in navbar
  - [ ] Long branch names display correctly
- [ ] **Mobile Responsiveness**:
  - [ ] Tables scroll horizontally on small screens
  - [ ] Forms stack properly on mobile
  - [ ] Navigation menu works on all screen sizes
  - [ ] Charts resize on mobile
  - [ ] Modals/overlays scale properly
- [ ] **Empty States**:
  - [ ] "No parcels found" shows when table is empty
  - [ ] "No messages" shows in empty inbox
  - [ ] "No branches yet" shows on About map if no branches
  - [ ] "No users" shows in empty user management table
  - [ ] Charts show "No data yet" when empty

### 7.4 Browser Console & Errors

- [ ] **No Console Errors**:
  - [ ] No red error messages in DevTools Console
  - [ ] No 404 errors for images/assets
  - [ ] No CORS errors
  - [ ] No uncaught promise rejections
- [ ] **Network Requests**:
  - [ ] API calls use correct endpoints
  - [ ] Authorization headers included in protected requests
  - [ ] Failed requests show user-friendly error messages
  - [ ] Loading states shown during API calls
- [ ] **Warnings** (Yellow in console):
  - [ ] React key warnings resolved
  - [ ] Deprecated method warnings fixed
  - [ ] Memory leak warnings addressed

### 7.5 Performance & Optimization

- [ ] **Page Load Times**:
  - [ ] Home page loads in < 3 seconds
  - [ ] Dashboard loads reasonably fast
  - [ ] Images optimized (proper formats and sizes)
  - [ ] No unnecessary re-renders
- [ ] **Animations**:
  - [ ] Smooth 60fps animations
  - [ ] No janky scrolling
  - [ ] Framer Motion transitions work smoothly
- [ ] **Memory**:
  - [ ] No memory leaks from event listeners
  - [ ] Components unmount properly
  - [ ] Intervals/timeouts cleaned up

### 7.6 Cross-Browser Compatibility

- [ ] Works on Chrome/Edge (Chromium)
- [ ] Works on Firefox
- [ ] Works on Safari (if Mac available)
- [ ] Mobile browsers (Chrome Mobile, Safari iOS)

### 7.7 Accessibility

- [ ] Form labels associated with inputs
- [ ] Buttons have proper aria-labels
- [ ] Alt text on images
- [ ] Focus states visible on interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Color contrast meets WCAG standards

### 7.8 Logging & Observability (Winston Integration)

- [ ] **Frontend Logs** (Check Developer Console):
  - [ ] Auth: Login/Register/Forgot/Reset actions log correctly
  - [ ] Profile: Name/Email/Password update attempts log correctly
  - [ ] Checkout: Plan selection and Reservation success/fail log correctly
  - [ ] Logs include timestamps and contextual data
- [ ] **Backend Logs** (Check `/logs/app.log` or server console):
  - [ ] Database connection success/error logs
  - [ ] Parcel creation and status update logs
  - [ ] Auth controller: Detailed security action logs (Password reset, Payment, etc.)
  - [ ] Error objects include stack traces and request IDs

---

## 8. Backend API Testing

### 8.1 Auth Endpoints (`/api/auth`)

- [ ] POST `/api/auth/register` - Creates new user
- [ ] POST `/api/auth/login` - Returns JWT token
- [ ] POST `/api/auth/forgot-password` - Generates reset token
- [ ] POST `/api/auth/reset-password` - Resets password with token
- [ ] POST `/api/auth/reserve` - Reserves a package plan
- [ ] GET `/api/auth/branches` - Returns all branches
- [ ] POST `/api/auth/branches` - Creates new branch (admin only)
- [ ] GET `/api/auth/users` - Returns all users (admin only)
- [ ] PUT `/api/auth/users/:id/role` - Updates user role (admin only)
- [ ] DELETE `/api/auth/users/:id` - Deletes user (admin only)
- [ ] PUT `/api/auth/profile` - Updates user profile

### 8.2 Parcel Endpoints (`/api/parcels`)

- [ ] POST `/api/parcels` - Creates new parcel (protected)
- [ ] GET `/api/parcels` - Gets parcels (filtered by role, protected)
- [ ] GET `/api/parcels/track/:trackingId` - Tracks parcel (public)
- [ ] PUT `/api/parcels/:id/status` - Updates parcel status (protected, role-based restrictions)
- [ ] POST `/api/parcels/assign` - Assigns rider to parcel (protected)
- [ ] GET `/api/parcels/reports` - Gets analytics/reports (protected, role-based)

### 8.3 Message Endpoints (`/api/messages`)

- [ ] POST `/api/messages` - Creates message (protected)
- [ ] GET `/api/messages` - Gets messages for user (protected, role-based)
- [ ] PUT `/api/messages/:id/read` - Marks message as read (protected)

### 8.4 AI Endpoint (`/api/ai`)

- [ ] POST `/api/ai/chat` - Gets AI response from Gemini (requires API key)

---

## 9. Seeded Data Testing

### 9.1 Test User Accounts (Password: `password123`)

- [ ] **Admin**: `admin@navilogix.com` (role: main_admin)
- [ ] **Branch Head**: `kamal@example.com` (role: branch_head, Branch: Kandy)
- [ ] **Delivery**: `sunil@example.com` (role: delivery_person, Branch: Main Office)
- [ ] **Regular User**: `chamara@example.com` (role: regular)

### 9.2 Test Tracking IDs

- [ ] `NL2026001` - Out for Delivery
- [ ] `NL2026002` - In Sub Branch
- [ ] `NL2026003` - Delivered
- [ ] `NL2026004` - Pending
- [ ] `NL2026005` - Out for Delivery
- [ ] (Test all seeded tracking IDs from NL2026001 to NL2026012+)

### 9.3 Test Branches

- [ ] Main Office - Colombo
- [ ] Kandy Branch
- [ ] Galle Branch
- [ ] Jaffna Branch
- [ ] Matara Branch
- [ ] (Verify all 8 seeded branches display on About page map)

---

## 10. Environment & Configuration

### 10.1 Environment Variables

- [ ] **Client** (`.env` in `/client`):
  - [ ] `VITE_FORMSPREE_FORM_ID` - Formspree form ID configured
- [ ] **Server** (`.env` in `/server`):
  - [ ] `PORT` - Server port (default 5000)
  - [ ] `MONGO_URI` - MongoDB connection string
  - [ ] `JWT_SECRET` - JWT secret key set
  - [ ] `GEMINI_API_KEY` - Google Gemini API key configured

### 10.2 Database Connection

- [ ] MongoDB connection successful
- [ ] Collections created: users, parcels, branches, messages
- [ ] Seeded data populated correctly (`npm run seed` works)
- [ ] Database credentials secured

### 10.3 External Services

- [ ] Formspree form submissions work
- [ ] Google Gemini AI responses work (chatbot)
- [ ] OpenStreetMap tiles load on maps
- [ ] OSRM route optimization working (if implemented)

---

## 11. Final Checklist Before Deployment

- [ ] All console errors resolved
- [ ] All warnings addressed
- [ ] Environment variables documented
- [ ] README.md updated with setup instructions
- [ ] .gitignore includes .env files
- [ ] Sensitive data not committed to git
- [ ] API keys secured
- [ ] Default admin account password changed
- [ ] Database seeded with initial data
- [ ] All routes tested and working
- [ ] Mobile responsive on all pages
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] CORS configured correctly
- [ ] Error handling implemented throughout
- [ ] Loading states on all async operations
- [ ] Success/error messages user-friendly
- [ ] Backup strategy for database
- [ ] Monitoring/logging set up

---

**Total Features to Test: 300+**

**Testing Priority:**

1. **Critical (P0)**: Authentication, Authorization, Parcel CRUD, Status Updates
2. **High (P1)**: Maps, Charts, User Management, Inbox
3. **Medium (P2)**: Animations, UI Polish, Social Sharing
4. **Low (P3)**: Edge cases, Minor visual issues
