# EasyGo BD - Complete System Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT SIDE (Browser)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           HTML Pages (All Updated)                     │ │
│  │  ├─ index.html (Login)                                │ │
│  │  ├─ register.html (Registration)                      │ │
│  │  ├─ homepage.html (Search)                            │ │
│  │  ├─ search.html (Results)                             │ │
│  │  ├─ seat.html (Seat Selection)                        │ │
│  │  ├─ booking.html (Confirmation)                       │ │
│  │  ├─ history.html (Booking History)                    │ │
│  │  └─ contact.html (Contact Form)                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         main-api.js (API Client Library)              │ │
│  │  ├─ registerUser()      → /api/auth/register         │ │
│  │  ├─ loginUser()         → /api/auth/login            │ │
│  │  ├─ searchRoute()       → /api/routes/search         │ │
│  │  ├─ selectRoute()       → /api/seats/:routeId        │ │
│  │  ├─ goBooking()         → /api/bookings/create       │ │
│  │  ├─ loadBookingHistory()→ /api/bookings/history      │ │
│  │  └─ submitContact()     → /api/contact/submit        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  localStorage (Session Management)                     │ │
│  │  ├─ auth_token (JWT)                                  │ │
│  │  ├─ current_user (User Info)                          │ │
│  │  ├─ selected_route_id                                 │ │
│  │  ├─ selected_seats                                    │ │
│  │  └─ booking_id                                        │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────┘
                               │
                  HTTP/HTTPS (JSON)
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    SERVER SIDE (Node.js)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         server.js (Express Application)                │ │
│  │  ├─ CORS Middleware                                    │ │
│  │  ├─ Body Parser Middleware                             │ │
│  │  ├─ Static File Server                                 │ │
│  │  └─ Error Handling                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         api.js (API Route Handlers)                    │ │
│  │  ├─ Authentication Routes                              │ │
│  │  │  ├─ POST /api/auth/register                         │ │
│  │  │  ├─ POST /api/auth/login                            │ │
│  │  │  └─ POST /api/auth/verify                           │ │
│  │  ├─ Route Search Routes                                │ │
│  │  │  ├─ GET /api/routes/search                          │ │
│  │  │  └─ GET /api/routes                                 │ │
│  │  ├─ Seat Routes                                        │ │
│  │  │  └─ GET /api/seats/:routeId                         │ │
│  │  ├─ Booking Routes                                     │ │
│  │  │  ├─ POST /api/bookings/create                       │ │
│  │  │  ├─ GET /api/bookings/history/:userId               │ │
│  │  │  └─ GET /api/bookings/:bookingId                    │ │
│  │  └─ Contact Routes                                     │ │
│  │     └─ POST /api/contact/submit                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    db.js (Database Initialization)                     │ │
│  │  ├─ Table Creation                                     │ │
│  │  ├─ Sample Data Seeding                                │ │
│  │  └─ Connection Management                              │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────┘
                               │
                        sqlite3 Interface
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                   DATABASE (SQLite3)                         │
│  File: data/easygo.db                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  users Table                                           │ │
│  │  ├─ id (INTEGER PRIMARY KEY)                           │ │
│  │  ├─ name (TEXT)                                        │ │
│  │  ├─ email (TEXT UNIQUE)                                │ │
│  │  ├─ password (TEXT - bcrypt hashed)                    │ │
│  │  └─ created_at (DATETIME)                              │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  routes Table                                          │ │
│  │  ├─ id (INTEGER PRIMARY KEY)                           │ │
│  │  ├─ from_city (TEXT)                                   │ │
│  │  ├─ to_city (TEXT)                                     │ │
│  │  ├─ departure_time (TEXT)                              │ │
│  │  ├─ price (REAL)                                       │ │
│  │  ├─ total_seats (INTEGER)                              │ │
│  │  ├─ bus_name (TEXT)                                    │ │
│  │  └─ created_at (DATETIME)                              │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  seats Table                                           │ │
│  │  ├─ id (INTEGER PRIMARY KEY)                           │ │
│  │  ├─ route_id (INTEGER FOREIGN KEY)                     │ │
│  │  ├─ seat_label (TEXT)                                  │ │
│  │  ├─ status (TEXT: 'available' or 'booked')             │ │
│  │  └─ booked_by (INTEGER FOREIGN KEY)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  bookings Table                                        │ │
│  │  ├─ id (INTEGER PRIMARY KEY)                           │ │
│  │  ├─ booking_id (TEXT UNIQUE - Format: EGB+timestamp)   │ │
│  │  ├─ user_id (INTEGER FOREIGN KEY)                      │ │
│  │  ├─ route_id (INTEGER FOREIGN KEY)                     │ │
│  │  ├─ seats (TEXT - JSON array)                          │ │
│  │  ├─ total_price (REAL)                                 │ │
│  │  ├─ booking_date (DATETIME)                            │ │
│  │  └─ status (TEXT)                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  contact_messages Table                                │ │
│  │  ├─ id (INTEGER PRIMARY KEY)                           │ │
│  │  ├─ name (TEXT)                                        │ │
│  │  ├─ email (TEXT)                                       │ │
│  │  ├─ message (TEXT)                                     │ │
│  │  ├─ status (TEXT)                                      │ │
│  │  └─ created_at (DATETIME)                              │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## User Journey Flow

### 1. Registration & Login Flow
```
User → register.html → registerUser() → /api/auth/register → users table
                                          ↓
                                    Password hashed (bcrypt)
                                          ↓
                                    User record created
                                          ↓
                                    JWT token generated
                                          ↓
                                    Token stored in localStorage
                                          ↓
                                        Login successful!
```

### 2. Search & Booking Flow
```
User → homepage.html → searchRoute() → /api/routes/search?from=X&to=Y
                                            ↓
                                    Query routes table
                                            ↓
                            Return matching routes → search.html
                                            ↓
                        selectRoute() → /api/seats/:routeId
                                            ↓
                                    Query seats table
                                            ↓
                        Display seats → seat.html
                                            ↓
                        User selects seats → goBooking()
                                            ↓
                        goBooking() → /api/bookings/create (with JWT)
                                            ↓
                    BEGIN TRANSACTION
                    ├─ Create booking record
                    ├─ Update seat status to 'booked'
                    └─ COMMIT TRANSACTION
                                            ↓
                        Booking ID generated (EGB+timestamp)
                                            ↓
                        loadBookingConfirmation() → booking.html
                                            ↓
                        Display confirmation with ID & details
```

### 3. View Booking History Flow
```
User → history.html → loadBookingHistory() → /api/bookings/history/:userId (JWT)
                                                    ↓
                                        Query bookings + routes (JOIN)
                                                    ↓
                                    Return all user bookings
                                                    ↓
                                Display booking list in history.html
```

### 4. Contact Form Flow
```
User → contact.html → submitContact() → /api/contact/submit
                                            ↓
                                    Insert into contact_messages
                                            ↓
                                    Return confirmation
                                            ↓
                            Display "Message sent successfully"
```

## Security Flow

```
User Input → Frontend Validation → API Endpoint
                                        ↓
                            Backend Validation
                                        ↓
                    ┌─────────────────┬──────────────────┐
                    ↓                  ↓                  ↓
            Authentication         Input Sanitize    SQL Parameters
            (JWT Verification)     (XSS Prevention)   (SQL Injection)
                    ├─────────────────┬──────────────────┤
                                      ↓
                            Database Transaction
                            (Atomic Operations)
                                      ↓
                            Response to Client
```

## Authentication Flow with JWT

```
User Login
    ↓
POST /api/auth/login (email, password)
    ↓
Database: Find user by email
    ↓
Password: bcrypt.compare(input, stored)
    ↓
Generate JWT Token (payload: id, email; expires: 24h)
    ↓
Return Token to Client
    ↓
Client: Store token in localStorage
    ↓
Subsequent Requests:
    ├─ Header: "Authorization: Bearer <token>"
    ├─ Server: Verify token with jwt.verify()
    ├─ Extract user ID from token
    └─ Process request with authenticated user
```

## Data Consistency

```
Booking Creation with Transactions
    ↓
BEGIN TRANSACTION
    ├─ INSERT INTO bookings (...)
    ├─ UPDATE seats SET status='booked' WHERE route_id=X AND seat_label=Y
    └─ COMMIT
    
Advantage: Prevents race conditions where:
    - Two users book same seat simultaneously
    - Seat becomes available after query but before update
    - Booking created but seats not marked
```

## Performance Optimization

```
✓ Indexes on Foreign Keys (route_id, user_id)
✓ UNIQUE constraint on (route_id, seat_label) prevents duplicates
✓ Parameterized queries prevent SQL injection
✓ JWT tokens reduce database queries for auth
✓ Transactions reduce locking time
✓ CORS allows caching at browser level
```

## Deployment Ready

```
Configuration:
├─ .env file for environment variables
├─ PORT configurable
├─ JWT_SECRET configurable
├─ NODE_ENV (development/production)
└─ Ready for Docker containerization

Scalability:
├─ RESTful API (horizontal scaling possible)
├─ SQLite (can migrate to PostgreSQL later)
├─ Stateless authentication (JWT)
└─ No session store required
```

---

This complete architecture ensures:
✅ **Data Integrity** - Transactions, constraints, foreign keys
✅ **Security** - Password hashing, JWT, input validation
✅ **Performance** - Optimized queries, proper indexing
✅ **Scalability** - RESTful design, stateless auth
✅ **Reliability** - Error handling, CORS, proper HTTP codes
✅ **Maintainability** - Clear code structure, documented APIs
