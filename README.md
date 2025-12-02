# Door2Goo — Full-Stack Delivery Platform

Door2Goo is a full-stack delivery web application built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB Atlas.  
The platform supports Customers, Drivers, and Admins with role-based access control, real-time order tracking, and a complete cart and checkout experience.

---

## Deployment

- Frontend: Deployed on Vercel
- Backend: Deployed on Render.com
- Database: Hosted on MongoDB Atlas

---

## Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- PostCSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcrypt.js
- Role-Based Access Control

---

## Features Implemented (After Phase 1)

### Authentication and Roles
- Customer, Driver, and Admin roles
- Role-based page access
- Secure login and logout
- JWT token handling

### User Profiles
- Phone number added for customers and drivers
- Driver vehicle type added during signup
- Profile editing with:
  - Name update
  - Password update with verification
  - Profile picture upload
- Email is locked from editing

### Cart and Checkout
- Live cart tracking
- Quantity control (increase, decrease, remove)
- Address entry during checkout
- Orders set to Pending after confirmation
- Only Customers can add items to cart

### Orders and Tracking
- Order tracking page with:
  - Item images
  - Quantity
  - Subtotal
- Customer sees:
  - Driver name
  - Phone number
  - Vehicle
- Driver console with:
  - Pending orders
  - Pickup and Delivered actions
- Both customer and driver can view delivered and pending orders

### UI Improvements
- Animated checkout button
- Styled cart matching catalog
- Fixed navbar username display
- Navbar folder renamed to frontend

---

## Project Structure (With Comments)

### Root Structure


Door2Goo/
├── .env # Global environment variables
├── .gitignore # Ignored files for GitHub
├── eslint.config.js # ESLint configuration
├── index.html # Root HTML file
├── package.json # Project dependencies
├── package-lock.json # Locked dependency versions
├── reactproject.esproj # IDE project file
├── README # Root documentation
├── structure.txt # Generated project tree
├── tailwind.config.js # Tailwind CSS configuration
├── theme.css # Global theme styling
├── ThemeContext.jsx # Global theme state manager
├── ThemeProvider.jsx # Theme provider wrapper
└── vite.config.js # Vite build configuration

### Backend Structure

backend/
├── config/
│ └── db.js # MongoDB Atlas connection
│
├── middleware/
│ ├── auth.js # JWT authentication middleware
│ └── error.js # Global error handler
│
├── models/
│ ├── Cart.js # Cart schema
│ ├── DriverLocation.js # Driver live location schema
│ ├── Order.js # Orders schema
│ ├── Product.js # Products schema
│ └── User.js # Users schema and roles
│
├── routes/
│ ├── auth.routes.js # Login and Signup routes
│ ├── cart.routes.js # Cart routes
│ ├── checkout.routes.js # Checkout routes
│ ├── driver.routes.js # Driver actions routes
│ ├── orders.routes.js # Orders routes
│ └── products.routes.js # Products routes
│
├── utils/
│ └── tokens.js # JWT token generation
│
├── .env # Backend environment variables
├── package.json
├── package-lock.json
└── server.js # Express server entry point


### Frontend (src) Structure


src/
├── Animations/ # UI motion effects
├── assets/ # Images and static assets
│
├── Components/
│ ├── GooeyNav.css
│ ├── GooeyNav.jsx
│ ├── LogoutButton.css
│ ├── LogoutButton.jsx
│ ├── Navbar.jsx
│ ├── OrderTracking.css
│ ├── PlaceOrderButton.css
│ └── PlaceOrderButton.jsx
│
├── frontend/
│ ├── axios.js
│ ├── Cart.jsx
│ ├── Catalog.jsx
│ ├── Checkout.jsx
│ ├── ContactUs.jsx
│ ├── Dashboard.jsx
│ ├── Details.jsx
│ ├── DriverConsole.jsx
│ ├── ElectricBorder.css
│ ├── ElectricBorder.jsx
│ ├── home.jsx
│ ├── login.css
│ ├── Login.jsx
│ ├── OrderTracking.jsx
│ ├── Profile.jsx
│ ├── Signup.jsx
│ └── vercel.json
│
├── public/
├── about.jsx
├── App.css
├── App.jsx
├── AuthContext.jsx
├── GetStarted.jsx
├── index.css
├── layout.jsx
├── main.jsx
├── postcss.config.js
├── ProtectedRoute.jsx
└── README.md


---

## Team Contributions

### Leopold Charles
- Backend restructuring and fixes
- Role-based users implementation
- Restricted unauthorized page access
- Added phone and vehicle to driver signup
- Profile updates for drivers and customers
- Order tracking progress
- Driver information visible to customers
- Driver Console with pickup and delivered actions
- Deployment fixes and backend API fixes

### Hamza Dayekh
- Inserted mockup data into MongoDB Atlas
- Linked backend and frontend for product catalog
- Linked backend and frontend for product details

### Rami Hachem
- Created cart page
- Styled cart to match catalog
- Live navbar cart counter
- Quantity control implementation
- Full checkout flow
- Restricted cart access to Customers only

### Mohammad Hazimeh
- Fixed order tracking crashes
- Order tracking UI adjustments
- Pending and delivered orders display
- Profile page creation with:
  - Editable name
  - Locked email
  - Verified password change
  - Picture upload

---

## Requirements

- Node.js v18+
- npm v9+

Check versions:
node -v
npm -v

## Environment Variables Setup

### Backend .env

PORT=5000
MONGO_URI=mongodb+srv://Door2Go:Door2Go123@door2go.opetk5r.mongodb.net/door2goDB?retryWrites=true&w=majority&appName=Door2Go
JWT_SECRET=your_secure_jwt_secret

### Frontend .env

VITE_API_URL=https://door2goo.onrender.com/api


---

## API Endpoints Overview

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Users and Profiles
- GET /api/users/profile
- PUT /api/users/profile

### Cart
- POST /api/cart/add
- GET /api/cart
- DELETE /api/cart/remove/:id

### Checkout
- POST /api/checkout

### Orders
- GET /api/orders
- PUT /api/orders/:id/status

### Drivers
- GET /api/driver/orders
- PUT /api/driver/pickup/:id
- PUT /api/driver/deliver/:id

### Products
- GET /api/products
- GET /api/products/:id

---

## Phase 4 Documentation  
Security, Roles and Backup

### Security Implementation
- JWT-based authentication
- Secure password hashing using bcrypt
- Token generation in backend/utils/tokens.js
- Protected backend routes in backend/middleware/auth.js
- Centralized error handling in backend/middleware/error.js

### Role-Based Access Control
- Roles: Customer, Driver, Admin
- Customers can add to cart, checkout and track orders
- Drivers can access Driver Console and manage delivery status
- Admin has full system access
- Role logic stored in backend/models/User.js

### Data Protection
- Environment variables hidden using .env
- .gitignore prevents leaking secrets
- JWT secret protected
- Database credentials secured via environment variables

### Backup Strategy
- Automatic MongoDB Atlas cloud backups
- Daily snapshot backups
- GitHub repository used as source code backup
- Frontend, backend and database hosted on independent platforms

---

## Deployment Setup

### Frontend Deployment (Vercel)
1. Push project to GitHub
2. Import project into Vercel
3. Set environment variable:

VITE_API_URL=https://door2goo.onrender.com/api

4. Deploy

### Backend Deployment (Render)
1. Create Web Service
2. Connect GitHub backend repository
3. Set root directory to:

backend

4. Add environment variables:

PORT=5000
MONGO_URI=mongodb+srv://Door2Go:Door2Go123@door2go.opetk5r.mongodb.net/door2goDB?retryWrites=true&w=majority&appName=Door2Go
JWT_SECRET=your_secure_jwt_secret


5. Deploy

### Database Setup (MongoDB Atlas)
1. Create free cluster
2. Add database user
3. Add network access 0.0.0.0/0
4. Copy connection string
5. Paste into Render .env

---

## System Status Summary

- Frontend: Online on Vercel
- Backend: Online on Render
- Database: Online on MongoDB Atlas
- Authentication: Working
- Roles: Fully applied
- Cart, Checkout and Tracking: Fully functional
- Driver Console: Fully functional
- Profile and Security: Fully active
- Deployment: Fully stable



