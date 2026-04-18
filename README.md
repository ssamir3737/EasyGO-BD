# EasyGo BD - Online Bus Ticket Booking System

## 🎯 Project Overview

EasyGo BD is a complete online bus ticket booking system built with **Node.js**, **Express.js**, and **SQLite3**. Users can search for bus routes, book tickets by selecting seats, view booking history, and contact support. The system includes robust security features and date-based booking restrictions.

## ✨ Key Features

### 🔐 User Management
- ✅ User registration with email validation
- ✅ Secure login with JWT authentication (24-hour expiry)
- ✅ Password hashing with bcryptjs
- ✅ Persistent user sessions with localStorage

### 🎫 Ticket Booking System
- ✅ Search bus routes by origin and destination
- ✅ **Date-restricted booking: Current date + next 2 days only**
- ✅ Interactive seat selection with real-time pricing
- ✅ Unique booking ID generation
- ✅ Booking confirmation with receipt details
- ✅ Complete booking history tracking
- ✅ Multiple payment status states

### 💾 Database & Storage
- ✅ SQLite3 persistent storage
- ✅ Automatic database initialization on startup
- ✅ 150 pre-loaded sample routes (50 routes × 3 dates)
- ✅ Transaction-based seat booking for consistency

### 🔌 REST API
- ✅ RESTful API with complete CRUD operations
- ✅ Input validation and sanitization
- ✅ Error handling and meaningful error messages
- ✅ CORS enabled for secure cross-domain requests
- ✅ Security headers (CSP, XSS Protection, etc.)

### 💱 Localization
- ✅ Currency: Bangladeshi Taka (Tk.)
- ✅ All prices displayed in local currency
- ✅ Localized UI and messaging

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
# or
node server.js

# 3. Open in browser
# Navigate to: http://localhost:5000
```

Server will run on `http://localhost:5000` with:
- Frontend available at root path
- API endpoints at `/api/*`

## 📁 Project Structure

```
EasyGO-BD/
├── server.js                 # Main HTTP server
├── db.js                     # Database initialization & setup
├── api.js                    # API route handlers
├── admin-api.js              # Admin dashboard API
├── main-api.js               # Frontend JavaScript API client
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
│
├── data/
│   └── easygo.db            # SQLite database file
│
├── HTML Pages (Frontend)
│   ├── index.html           # Landing page
│   ├── login-choice.html    # Login/Register choice
│   ├── login.html           # User login
│   ├── register.html        # User registration
│   ├── homepage.html        # Main search page
│   ├── search.html          # Search results
│   ├── seat.html            # Seat selection & booking
│   ├── booking.html         # Booking confirmation
│   ├── payment.html         # Payment page
│   ├── history.html         # Booking history
│   ├── contact.html         # Contact/Support form
│   ├── admin-login.html     # Admin login
│   └── admin-dashboard.html # Admin panel
│
├── styles/
│   └── style.css            # Main stylesheet (responsive)
│
├── image/
│   └── *.png                # Images & logos
│
└── Database/
    └── create_db.py         # Python scripts for DB operations
```

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/verify` - Verify JWT token validity

### Bus Routes
- `GET /api/routes/search?from=X&to=Y` - Search routes (filtered by date: today ± 2 days)
- `GET /api/routes` - Get all available routes

### Seats & Booking
- `GET /api/seats/:routeId` - Get seat availability for a route
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/:bookingId` - Get booking details
- `GET /api/bookings/history/:userId` - Get user's booking history

### Support
- `POST /api/contact/submit` - Submit contact/support message
- `POST /api/admin/request` - Submit admin request
- `GET /api/admin/requests` - Get all admin requests

## 🗄️ Database Schema

### users
```sql
id (PRIMARY KEY)
name (TEXT)
email (TEXT, UNIQUE)
password (TEXT, hashed)
gender (TEXT)
created_at (DATETIME)
```

### routes
```sql
id (PRIMARY KEY)
from_city (TEXT)
to_city (TEXT)
departure_date (TEXT, YYYY-MM-DD)  -- Date-based filtering
departure_time (TEXT)
price (REAL)
total_seats (INTEGER, default 36)
available_seats (INTEGER)
bus_name (TEXT)
created_at (DATETIME)
```

### seats
```sql
id (PRIMARY KEY)
route_id (FOREIGN KEY)
seat_label (TEXT, e.g., "A1")
status (TEXT: "available"/"booked")
booked_by (FOREIGN KEY to users.id)
```

### bookings
```sql
id (PRIMARY KEY)
booking_id (TEXT, unique identifier)
user_id (FOREIGN KEY)
route_id (FOREIGN KEY)
seats (JSON array of seat labels)
total_price (REAL)
booking_date (DATETIME)
status (TEXT: "pending"/"confirmed"/"cancelled")
```

### contact_messages
```sql
id (PRIMARY KEY)
name (TEXT)
email (TEXT)
message (TEXT)
status (TEXT: "new"/"responded")
created_at (DATETIME)
```

### admin_requests
```sql
id (PRIMARY KEY)
user_id (FOREIGN KEY)
user_name (TEXT)
user_email (TEXT)
request (TEXT)
route_id (FOREIGN KEY, optional)
status (TEXT: "pending"/"reviewed"/"resolved")
response (TEXT)
created_at (DATETIME)
```

## 📊 Sample Data

On first startup, the system automatically creates:
- **150 bus routes** (50 unique routes × 3 dates)
- **3 dates**: Today, Tomorrow, Day after tomorrow
- **36 seats per route** (9 rows × 4 columns: A1-I4)
- **10+ cities** including Dhaka, Chittagong, Sylhet, Cox's Bazar, etc.

## 🔐 Security Features

- **Password Security**: bcryptjs hashing (salt rounds: 10)
- **Authentication**: JWT tokens with 24-hour expiry
- **Input Validation**: All inputs sanitized and validated
- **Database Security**: Parameterized queries prevent SQL injection
- **HTTP Security Headers**: CSP, X-Frame-Options, XSS Protection
- **CORS**: Restricted to allowed origins
- **Session Management**: Token-based, no session file exposure

## 🧪 Testing the System

### Admin Account (Pre-created)
```
Email: admin@gmail.com
Password: 12345678
```

### Test Booking Flow
1. Register a new user
2. Login with credentials
3. Search routes (filtered for current + next 2 days)
4. Select a route and book seats
5. View booking history

## 📝 Recent Updates

### Date-Based Booking Restrictions
- ✅ Modified routes table to include `departure_date`
- ✅ Updated searchRoutes API to filter by valid dates only
- ✅ Database now contains 150 routes with date filtering
- ✅ Users can only book for current date and next 2 days
 Taka)

### Security Enhancements
- ✅ Input sanitization across all API endpoints
- ✅ Security headers implementation
- ✅ CORS protection

## 🛠️ Development

### Environment Variables (.env)
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

## 👨‍💻 Contributors

- **Developer**: Samir
- **Project**: EasyGO BD Bus Booking System

## 📞 Support

For issues, bugs, or feature requests, please create a GitHub issue or contact us through the app.

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
# EasyGO-BD
