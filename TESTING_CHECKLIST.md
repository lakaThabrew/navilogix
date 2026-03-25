# NaviLogix - Comprehensive QA Testing Checklist

This checklist contains all the features, functions, and buttons you need to test in the NaviLogix platform, separated by User Roles and specific pages.

---

## 1. General & Public Pages

### 1.1 Navigation Bar (`Navbar.jsx`)

- [✓] **Logo**: Clicks redirect to Home page with smooth hover animation
- [✓] **Desktop Menu**: All navigation links work correctly
- [✓] **Mobile Menu**:
  - [✓] Hamburger menu icon toggles open/close properly
  - [✓] Mobile menu slides in/out with animation
  - [✓] Clicking any link closes the mobile menu
- [✓] **Role-Based Navigation**:
  - [✓] Guest users see: About, Services, Contact, Login, Register
  - [✓] Regular users see: About, Services, Contact, Dashboard, Profile
  - [✓] Admin/Staff see: Dashboard, Profile (+ Inbox/Reports for main admin, Branch Reports for branch head)
  - [✓] About, Services, Contact hidden for admin/delivery/branch head roles
- [✓] **Login/Register Buttons** (when logged out):
  - [✓] Login button navigates to `/login`
  - [✓] Register button navigates to `/register` with hover animations
- [✓] **Logout Button** (when logged in):
  - [✓] Clears localStorage and redirects to `/login`
  - [✓] Gradient button with proper hover effects

### 1.2 Home Page (`Home.jsx`)

- [✓] Hero section animations load smoothly
- [✓] Track & Trace Search Bar:
  - [✓] Accepts tracking ID input
  - [✓] Clicking "Track" navigates to tracking page
  - [✓] Shows validation for empty input
- [✓] "Get Started" button navigates to register page
- [✓] All floating card animations work properly
- [✓] Background gradient orbs animate smoothly

### 1.3 About Page (`About.jsx`)

- [✓] Leaflet Map loads correctly without broken icons
- [✓] Branch markers display on map with proper pins
- [✓] Clicking branch markers shows popup with branch details:
  - [✓] Branch name
  - [✓] Branch phone Number
  - [✓] Service Areas
- [✓] "From Idea to Global Impact" section displays with proper styling
- [✓] All team/mission content is visible
- [✓] Mobile responsive layout works correctly

### 1.4 Services Page (`Services.jsx`)

- [✓] Three pricing tiers display correctly (Free, Plus, Pro)
- [✓] Each package shows:
  - [✓] Package name and pricing
  - [✓] Feature list with checkmarks
  - [✓] Proper hover animations on cards
- [✓] **Action Buttons**:
  - [✓] Free Package → "Get Started" navigates to `/register`
  - [✓] Plus Package → "Buy Plus" navigates to `/dashboard`
  - [✓] Pro Package → "Contact Sales" navigates to `/contact`
- [✓] Mobile responsive grid layout works

### 1.5 Contact Page (`Contact.jsx`)

- [✓] **Contact Form (Formspree Integration)**:
  - [✓] Form validates all required fields (Name, Email, Subject, Message)
  - [✓] Email field validates proper email format
  - [✓] Submit button shows loading state "Sending..."
  - [✓] Success message displays after submission
  - [✓] Form clears after successful submission
  - [✓] Formspree API key is configured correctly
  - [✓] ValidationError components display properly for errors
- [✓] **Contact Information Cards** display:
  - [✓] Headquarters address (with line break)
  - [✓] Phone numbers
  - [✓] Email support address
  - [✓] Business hours
  - [✓] All cards have hover animations
- [✓] **Premium Support Section**:
  - [✓] "Consult with AI" button triggers chatbot to open
  - [✓] Background animations and gradients work
- [✓] **RadialShareMenu Component**:
  - [✓] Auto-opens after 1 second on page load
  - [✓] Toggle button opens/closes radial menu
  - [ ] All 7 social icons display correctly:
    - [✓] WhatsApp (0°) - Opens whatsapp link
    - [✓] Facebook (51.4°) - Opens facebook link
    - [✓] Email (102.8°) - Opens mailto link
    - [✓] Instagram (154.2°) - Opens instagram link
    - [✓] Web (205.6°) - Opens navilogix.com
    - [✓] GitHub (257°) - Opens github link
    - [✓] Twitter (308.4°) - Opens twitter link
  - [✓] Each icon has correct color and hover tooltip
  - [✓] Clicking icons opens correct external links
  - [✓] Mobile responsiveness (smaller radius on mobile)

### 1.6 Tracking Page (`Track.jsx` - `/track/:id`)

- [✓] Entering valid Tracking ID shows:
  - [✓] Parcel status with color-coded badge
  - [✓] Sender information (name, address, contact)
  - [✓] Receiver information (name, address, contact)
  - [✓] Parcel details (weight, type, COD amount)
  - [✓] Complete timeline/history with status updates
  - [✓] Branch information if assigned
  - [✓] Delivery date if applicable
- [✓] Entering invalid Tracking ID shows:
  - [✓] "Parcel not found" error message
  - [✓] User-friendly error styling
- [✓] Status badge colors correct:
  - [✓] Delivered = green
  - [ ] Returned = red
  - [✓] Out for Delivery = orange
  - [✓] In the branch = blue
  - [✓] Pending = Yellow
- [✓] Mobile responsive layout
- [✓] Timeline animations work smoothly

### 1.7 AI Chatbot Component (`ChatBot.jsx`)

- [✓] **Floating Chat Button**:
  - [✓] Visible on all pages at bottom right
  - [✓] Opens/closes chat window on click
  - [✓] Proper z-index (above other elements)
- [ ] **Chat Window**:
  - [✓] Displays welcome message from bot
  - [✓] User messages align right (blue background)
  - [✓] Bot messages align left (white background)
  - [✓] "..." loading indicator shows while waiting for response
  - [✓] Input field accepts text
  - [✓] Enter key sends message
  - [✓] Send button sends message
  - [✓] auto Scroll to bottom on new messages
- [ ] **AI Integration**:
  - [✓] Sends message to `/api/ai/chat` endpoint
  - [✓] Receives response from Gemini AI
  - [✓] Shows error message if API fails
  - [✓] Chatbot can answer parcel-related queries
- [✓] **Event Listener**:
  - [✓] Works from Contact page "Consult with AI" button
- [✓] Mobile responsive (full width minus padding)

### 1.8 Footer Component (`Footer.jsx`)

- [✓] Logo displays correctly and connect this to Home Page
- [✓] Social media icons (Facebook, Twitter, LinkedIn) work with hover effects
- [✓] Social meida icons connects to external links
- [✓] Quick Links section shows all navigation links
- [✓] Contact information displays properly
- [✓] Copyright year is current
- [✓] All links navigate correctly
- [✓] Mobile responsive columns

---

## 2. Authentication & Profile

### 2.1 Auth Component (`Auth.jsx` - Unified Login/Register/Forgot/Reset)

#### **Mode: Login (`/login`)**

- [ ] **Visual Panel** (left side on desktop):
  - [ ] "Welcome Back!" heading with gradient text
  - [ ] Description text displays correctly
  - [ ] Lock emoji (🔐) displays
  - [ ] Background animations work
  - [ ] Pattern overlay visible
- [ ] **Form Panel** (right side):
  - [ ] Logo displays and has hover scale effect
  - [ ] Toggle switch "LOGIN" is highlighted
  - [ ] Email field:
    - [ ] Required field validation
    - [ ] Email format validation
    - [ ] Placeholder text shows
  - [ ] Password field:
    - [ ] Required field validation
    - [ ] Show/hide password toggle (Eye icon) works
    - [ ] Password masks as bullets when hidden
  - [ ] "Forgot Password?" link navigates to `/forgot-password`
  - [ ] "SIGN IN" button:
    - [ ] Shows "Signing in..." when loading
    - [ ] Disables during submission
    - [ ] Successful login stores token in localStorage
    - [ ] Redirects to `/dashboard` after success
    - [ ] Shows error alert for invalid credentials

#### **Mode: Register (`/register`)**

- [ ] **Visual Panel**:
  - [ ] "Join the Fleet" heading displays
  - [ ] Rocket emoji (🚀) displays
  - [ ] Description text shows
- [ ] **Toggle Switch**: "REGISTER" is highlighted
- [ ] **Form Fields**:
  - [ ] Full Name field (required)
  - [ ] Email field (required, email validation)
  - [ ] Password field with show/hide toggle
  - [ ] **Password Strength Meter**:
    - [ ] Shows when typing password
    - [ ] Displays score label (Empty/Weak/Fair/Good/Strong)
    - [ ] Progress bar fills based on strength
    - [ ] Colors change (gray/red/orange/blue/green)
    - [ ] Criteria: length, uppercase, numbers, special chars
- [ ] **Payment Prompt** (for regular users):
  - [ ] Confirms "Proceed to setup payment?"
  - [ ] Canceling stops registration
- [ ] **Create Account Button**:
  - [ ] Shows "Creating..." when loading
  - [ ] Creates user account successfully
  - [ ] Stores token in localStorage
  - [ ] Redirects to `/dashboard`
  - [ ] Shows error alert if registration fails

#### **Mode: Forgot Password (`/forgot-password`)**

- [ ] **Visual Panel**:
  - [ ] "Recover Access" heading
  - [ ] Email emoji (📧) displays
- [ ] **Form**:
  - [ ] Recovery Email field (required)
  - [ ] "Send Token" button works
  - [ ] Shows "Sending..." during submission
  - [ ] Success alert shows after token sent
  - [ ] Switches to "reset" mode after success
  - [ ] "Back to Login" button returns to login
- [ ] **Backend**: Check server console for reset token

#### **Mode: Reset Password (internal mode)**

- [ ] **Visual Panel**:
  - [ ] "Secure Account" heading
  - [ ] Shield emoji (🛡️) displays
- [ ] **Form**:
  - [ ] Reset Token field (required)
  - [ ] New Password field with show/hide toggle
  - [ ] Confirm Password field with show/hide toggle
  - [ ] Validates passwords match
  - [ ] Shows error if passwords don't match
  - [ ] "Update Password" button:
    - [ ] Shows "Resetting..." when loading
    - [ ] Successfully resets password
    - [ ] Shows success alert
    - [ ] Returns to login mode
    - [ ] Shows error if token invalid/expired

#### **General Auth Features**:

- [ ] Mobile responsive layout
- [ ] Form animations (slide in/out) work
- [ ] Background decorative elements animate
- [ ] All inputs have proper focus states
- [ ] Buttons have hover/tap animations
- [ ] URL syncs with mode (`/login`, `/register`, `/forgot-password`)

### 2.2 Profile Page (`Profile.jsx`)

- [ ] **User Information Display**:
  - [ ] Name displays correctly
  - [ ] Email displays correctly
  - [ ] Role displays correctly
  - [ ] Branch displays (if branch_head or delivery_person)
  - [ ] Payment status shows (if regular user)
- [ ] **Update Name**:
  - [ ] Input field pre-filled with current name
  - [ ] Can modify name
  - [ ] "Update Name" button works
  - [ ] Success message shows
  - [ ] Name updates across entire app (Navbar, Dashboard, etc.)
- [ ] **Update Email**:
  - [ ] Input field pre-filled with current email
  - [ ] Validates email format
  - [ ] "Update Email" button works
  - [ ] Success message shows
  - [ ] Requires re-login with new email
- [ ] **Update Password**:
  - [ ] Current password field (required)
  - [ ] New password field (required)
  - [ ] Confirm new password field (required)
  - [ ] Validates passwords match
  - [ ] Shows error if current password wrong
  - [ ] Successfully updates password
  - [ ] Requires re-login after change
- [ ] Mobile responsive form layout
- [ ] All buttons have loading states

---

## 3. Role: Main Admin (`main_admin`)

### 3.1 Navigation Access

- [ ] Can access: Home, Dashboard, Inbox, Reports, Profile
- [ ] Cannot see: About, Services, Contact (hidden for admin)
- [ ] Navbar shows "Inbox" and "Reports" links

### 3.2 Dashboard (`/dashboard`)

#### **Statistics Cards**

- [ ] Total Parcels count displays correctly
- [ ] Delivered count (green card)
- [ ] Returned count (red card)
- [ ] Total COD Revenue displays

#### **Notifications/Messages Section**

- [ ] Notification bell icon visible
- [ ] Unread message count badge shows
- [ ] Clicking notification area marks messages as read
- [ ] Messages from Branch Heads display:
  - [ ] Sender name
  - [ ] Message content
  - [ ] Timestamp
  - [ ] "Approve" button (if parcel request)
- [ ] Clicking "Approve" creates parcel from request
- [ ] Success alert after approval

#### **Add New Parcel Form** (Main Office)

- [ ] Form visible to main_admin
- [ ] **Sender Information**:
  - [ ] Name field (required)
  - [ ] Address field (required)
  - [ ] Contact field (required)
- [ ] **Receiver Information**:
  - [ ] Name field (required)
  - [ ] Address field (required)
  - [ ] Contact field (required)
- [ ] **Parcel Details**:
  - [ ] Weight field
  - [ ] Type dropdown (Standard, Document, Parcel)
  - [ ] COD Amount field
- [ ] **Submit Button**: "Add Parcel to System"
  - [ ] Creates parcel immediately (not a request)
  - [ ] Auto-assigns branch based on receiver address
  - [ ] Generates unique tracking ID
  - [ ] Success alert shows
  - [ ] Form clears after submission
  - [ ] Parcel appears in table below

#### **Add Branch Form**

- [ ] Form appears for main_admin
- [ ] Fields: Branch Name, City, Latitude, Longitude
- [ ] Required field validation works
- [ ] "Add Branch" button creates new branch
- [ ] Success alert displays
- [ ] Form clears after success
- [ ] New branch appears in system (check About page map)

#### **Add Staff User Form**

- [ ] Form visible to main_admin
- [ ] Fields: Name, Email, Password, Role, Branch (conditional)
- [ ] Role dropdown shows:
  - [ ] Regular
  - [ ] Delivery Person
  - [ ] Branch Head
  - [ ] Main Admin
- [ ] **Branch Selection**:
  - [ ] Dropdown appears when "Branch Head" or "Delivery Person" selected
  - [ ] Dropdown hidden for "Regular" and "Main Admin"
  - [ ] Lists all available branches
- [ ] **Create User Button**:
  - [ ] Creates user successfully
  - [ ] Assigns branch if applicable
  - [ ] Success alert shows
  - [ ] Form clears
  - [ ] New user visible in Reports > User Management

#### **Parcels Overview Table**

- [ ] Shows ALL parcels in system (admin has full access)
- [ ] **Columns Display**:
  - [ ] Tracking ID
  - [ ] Receiver Address
  - [ ] Branch Name
  - [ ] Status (dropdown for editing)
  - [ ] Actions column
- [ ] **Status Dropdown** (for each parcel):
  - [ ] Can select: Pending, In Main Branch, Transmitting, In Sub Branch
  - [ ] **Restrictions**: Cannot directly set to "Out for Delivery" or "Delivered"
  - [ ] Changing status updates immediately
  - [ ] Status color changes based on selection
  - [ ] Updates history timeline
- [ ] **Quick Action Buttons**:
  - [ ] "Transmit to Branch" appears when status is "In Main Branch"
  - [ ] Clicking changes status to "Transmitting"
  - [ ] Button shows for parcels with assigned branches
- [ ] **Assign Rider Dropdown**:
  - [ ] Shows "Assign Rider" dropdown for parcels in "In Sub Branch" status
  - [ ] Lists only delivery persons from the parcel's branch
  - [ ] Assigning rider shows success message
  - [ ] Rider name appears in table after assignment
- [ ] Table pagination/scroll works
- [ ] Mobile responsive (horizontal scroll)

### 3.3 Inbox Page (`/inbox`)

- [ ] Accessible from Navbar "Inbox" link
- [ ] Shows current user role in heading
- [ ] Displays unread message count badge
- [ ] **Message List**:
  - [ ] Unread messages highlighted (blue background, blue dot)
  - [ ] Read messages have reduced opacity
  - [ ] Each message shows:
    - [ ] Sender name
    - [ ] Message content
    - [ ] Timestamp
    - [ ] Read/unread indicator dot
  - [ ] Clicking message marks it as read
- [ ] **Approval Flow** (for parcel requests):
  - [ ] Messages with parcelData show "Approve" button
  - [ ] Clicking "Approve" prompts confirmation
  - [ ] Confirming creates parcel in system
  - [ ] Success alert displays
  - [ ] Message marked as read after approval
  - [ ] Error alert if approval fails
- [ ] Empty state displays if no messages
- [ ] Mobile responsive layout

### 3.4 Reports/Analytics Page (`/reports`)

- [ ] Accessible from Navbar "Reports" link
- [ ] Page title: "System Analytics"

#### **Date Filter Section**

- [ ] Start Date input field
- [ ] End Date input field
- [ ] "Apply Filter" button:
  - [ ] Filters all data by date range
  - [ ] Updates all charts and stats
- [ ] "Clear" button:
  - [ ] Resets dates to empty
  - [ ] Shows all-time data again

#### **Key Metrics Cards**

- [ ] **Total Parcels** (blue border) - Count of all parcels in date range
- [ ] **Total Revenue (COD)** (green border) - Sum of all COD amounts
- [ ] **Pending Delivery** (yellow border) - Count of non-delivered/returned
- [ ] **Returns** (red border) - Count of returned parcels

#### **Charts Section**

- [ ] **Branch Performance** (Bar Chart):
  - [ ] X-axis: Branch names
  - [ ] Y-axis: Parcel count
  - [ ] Shows "No branch data yet" if empty
  - [ ] Chart is responsive
- [ ] **Rider Efficiency** (Bar Chart):
  - [ ] Two bars per rider: Assigned vs Delivered
  - [ ] Different colors for each bar
  - [ ] Shows rider names
  - [ ] Shows "No rider data yet" if empty
- [ ] **Parcel Status Breakdown** (Doughnut Chart):
  - [ ] Shows all status types with counts in labels
  - [ ] Different colors for each status
  - [ ] Legend at bottom
  - [ ] Centered in card
  - [ ] Shows "No status data yet" if empty
- [ ] **Parcel Types** (Pie Chart):
  - [ ] Shows parcel types (Document, Package, Standard)
  - [ ] Counts in labels
  - [ ] Legend at bottom
  - [ ] Shows "No parcel type data yet" if empty
- [ ] All charts resize properly on mobile

#### **User Management Section**

- [ ] Section visible only to main_admin
- [ ] Heading: "User Management"
- [ ] "Add New User" button:
  - [ ] Opens in new tab
  - [ ] Navigates to `/register`
- [ ] **User Management Table**:
  - [ ] **Columns**: Name, Email, Current Role, Branch, Actions
  - [ ] Lists ALL users in system
  - [ ] **Role Dropdown** (for each user):
    - [ ] Options: Regular, Delivery Person, Branch Head, Main Admin
    - [ ] Changing dropdown updates role immediately
    - [ ] Success alert after update
    - [ ] Refetches user list
  - [ ] **Branch Assignment Dropdown**:
    - [ ] Shows only for Branch Head and Delivery Person roles
    - [ ] Shows "N/A" for Regular and Main Admin
    - [ ] Lists all available branches
    - [ ] Selecting branch updates user immediately
  - [ ] **Remove Button**:
    - [ ] Shows confirmation dialog
    - [ ] Deletes user from system
    - [ ] Success message after deletion
    - [ ] User removed from table
    - [ ] Error alert if deletion fails
  - [ ] Table hover effects work
  - [ ] Horizontal scroll on mobile

---

## 4. Role: Branch Head (`branch_head`)

### 4.1 Navigation Access

- [ ] Can access: Home, Dashboard, Profile
- [ ] Cannot see: About, Services, Contact, Inbox, Reports
- [ ] Navbar simplified for branch head

### 4.2 Dashboard (`/dashboard`)

#### **Statistics Cards**

- [ ] Shows stats for ONLY their branch parcels
- [ ] Total Parcels (filtered by branch)
- [ ] Delivered count (from their branch)
- [ ] Returned count (from their branch)
- [ ] COD Revenue (from their branch)

#### **Add Parcel Form** (Branch Head Version)

- [ ] Form visible to branch head
- [ ] Same fields as admin form (Sender Info, Receiver Info, Parcel Details)
- [ ] **Submit Button**: "Send Request to Main Admin"
  - [ ] Does NOT create parcel directly
  - [ ] Sends notification message to Main Admin
  - [ ] Message contains parcel data for approval
  - [ ] Success alert: "Request Sent to Main Admin!"
  - [ ] Form clears after submission
  - [ ] Parcel does NOT appear in table until approved

#### **Parcels Overview Table**

- [ ] Shows ONLY parcels where:
  - [ ] Branch ID matches branch head's branch
  - [ ] OR createdBy matches branch head's user ID
- [ ] **Status Dropdown**:
  - [ ] Can select: Pending, In Main Branch, Transmitting, In Sub Branch
  - [ ] **Restriction**: Cannot set to "Delivered" (only riders can)
  - [ ] Can set to "Out for Delivery" (unlike admin)
  - [ ] Changing status updates parcel
- [ ] **Quick Action Buttons**:
  - [ ] "Receive at Branch" button shows when status is "Transmitting"
  - [ ] Clicking changes status to "In Sub Branch"
  - [ ] Success message displays
- [ ] **Auto-Assignment Feature**:
  - [ ] When they change status to "In Sub Branch"
  - [ ] System automatically assigns an available delivery person from their branch
  - [ ] Success message mentions auto-assignment
  - [ ] Rider name appears in table
  - [ ] **Check Logic**:
    - [ ] Assigns rider with least currently assigned parcels
    - [ ] Only assigns riders from same branch
    - [ ] Respects MAX_DAILY_DELIVERIES constant
- [ ] Table only shows branch-relevant parcels

#### **Restrictions**

- [ ] Cannot add branches
- [ ] Cannot add staff users
- [ ] Cannot access system analytics
- [ ] Cannot manage other users

---

## 5. Role: Delivery Person / Rider (`delivery_person`)

### 5.1 Navigation Access

- [ ] Can access: Home, Dashboard, Profile
- [ ] Cannot see: About, Services, Contact, Inbox, Reports
- [ ] Simplified navbar

### 5.2 Dashboard (`/dashboard`)

#### **Statistics Cards**

- [ ] Shows ONLY their assigned parcels
- [ ] Total Parcels (assigned to them)
- [ ] Delivered count (they delivered)
- [ ] Returned count (they marked as returned)
- [ ] COD collected (from their deliveries)

#### **Parcels Overview Table**

- [ ] Shows ONLY parcels where `riderId` matches their user ID
- [ ] **Status Display**:
  - [ ] Status shown as colored badge (NOT dropdown)
  - [ ] Cannot change status via dropdown
- [ ] **Action Buttons** (per parcel):
  - [ ] "Mark Delivered" button:
    - [ ] Visible for all non-delivered parcels
    - [ ] Clicking updates status to "Delivered"
    - [ ] Success message displays
    - [ ] Button text changes to "Delivered ✔" after clicking
    - [ ] Button becomes disabled after delivered
  - [ ] "Mark Returned" button:
    - [ ] Always visible
    - [ ] Clicking updates status to "Returned"
    - [ ] Success message displays
    - [ ] Used when delivery unsuccessful
- [ ] **Restriction**: Can ONLY set status to "Delivered" or "Returned"
- [ ] No other status options visible

#### **Delivery Map Component** (`DeliveryMap.jsx`)

- [ ] Map section displays below table
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
  - [ ] Negative weight rejected
  - [ ] Negative COD amount rejected
  - [ ] Empty required fields show validation errors
  - [ ] Invalid phone numbers handled gracefully
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

---

## 8. Backend API Testing

### 8.1 Auth Endpoints (`/api/auth`)

- [ ] POST `/api/auth/register` - Creates new user
- [ ] POST `/api/auth/login` - Returns JWT token
- [ ] POST `/api/auth/forgot-password` - Generates reset token
- [ ] POST `/api/auth/reset-password` - Resets password with token
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
  - [ ] API base URL if different from default
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
