# EasyGo BD - Online Ticket Booking System
## Complete Backend Setup & Installation Guide

### ✅ What's Included

This package now includes a complete backend solution with:
- **Node.js/Express** server with RESTful API
- **SQLite3** database for persistent data storage
- **JWT Authentication** for secure user login
- **Bcrypt** for password hashing
- **Complete database schema** with all necessary tables
- **CORS** enabled for frontend-backend communication
- **Sample data** pre-loaded for routes and seats

### 📋 Prerequisites

Before starting, make sure you have installed:
- **Node.js** (v14 or higher) - Download from https://nodejs.org/
- **npm** (comes with Node.js)

### 🚀 Installation Steps

#### 1. Navigate to Project Directory
```bash
cd Online-ticket-Booking-Project-main
```

#### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- express
- sqlite3
- bcryptjs
- jsonwebtoken
- cors
- body-parser
- dotenv

#### 3. Start the Backend Server
```bash
npm start
```

Or for development mode with auto-reload:
```bash
npm run dev
```

You should see:
```
✓ Server running on http://localhost:5000
✓ API endpoints available at http://localhost:5000/api
✓ Frontend available at http://localhost:5000
```

#### 4. Open in Browser
Navigate to: `http://localhost:5000`

### 📁 Project Structure

```
Online-ticket-Booking-Project-main/
├── server.js                 # Main Express server
├── db.js                     # Database initialization & schema
├── api.js                    # All API route handlers
├── main-api.js              # Frontend JavaScript with API calls
├── package.json             # Dependencies
├── .env                     # Environment configuration
├── data/
│   └── easygo.db           # SQLite database (auto-created)
├── HTML Pages
│   ├── index.html          # Landing page
│   ├── login.html          # User login
│   ├── register.html       # User registration
│   ├── homepage.html       # Route search
│   ├── search.html         # Search results
│   ├── seat.html           # Seat selection
│   ├── booking.html        # Booking confirmation
│   ├── history.html        # Booking history
│   ├── contact.html        # Contact form
│   └── guest.html          # Guest mode
├── styles/
│   └── style.css           # Main stylesheet
├── image/                  # Images folder
└── Database/               # Legacy database files (optional)
```

### 🔌 API Endpoints

#### Authentication
- **POST** `/api/auth/register` - Register new user
  - Body: `{ name, email, password, confirmPassword }`
  - Returns: `{ success, token, user }`

- **POST** `/api/auth/login` - User login
  - Body: `{ email, password }`
  - Returns: `{ success, token, user }`

- **POST** `/api/auth/verify` - Verify JWT token
  - Body: `{ token }`
  - Returns: `{ success, user }`

#### Routes
- **GET** `/api/routes/search?from=X&to=Y` - Search routes
  - Returns: `{ success, routes[] }`

- **GET** `/api/routes` - Get all routes
  - Returns: `{ success, routes[] }`

#### Seats
- **GET** `/api/seats/:routeId` - Get available seats for a route
  - Returns: `{ success, seats[] }`

#### Bookings
- **POST** `/api/bookings/create` - Create a new booking
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ userId, routeId, seats[], totalPrice }`
  - Returns: `{ success, bookingId }`

- **GET** `/api/bookings/history/:userId` - Get user's booking history
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success, bookings[] }`

- **GET** `/api/bookings/:bookingId` - Get booking details
  - Returns: `{ success, booking }`

#### Contact
- **POST** `/api/contact/submit` - Submit contact form
  - Body: `{ name, email, message }`
  - Returns: `{ success }`

#### Health Check
- **GET** `/api/health` - Server status
  - Returns: `{ status, timestamp }`

### 🗄️ Database Tables

#### users
```
id (INTEGER, PRIMARY KEY)
name (TEXT)
email (TEXT, UNIQUE)
password (TEXT - hashed)
created_at (DATETIME)
```

#### routes
```
id (INTEGER, PRIMARY KEY)
from_city (TEXT)
to_city (TEXT)
departure_time (TEXT)
price (REAL)
total_seats (INTEGER)
bus_name (TEXT)
created_at (DATETIME)
```

#### seats
```
id (INTEGER, PRIMARY KEY)
route_id (INTEGER, FOREIGN KEY)
seat_label (TEXT)
status (TEXT: 'available' or 'booked')
booked_by (INTEGER, FOREIGN KEY to users)
```

#### bookings
```
id (INTEGER, PRIMARY KEY)
booking_id (TEXT, UNIQUE)
user_id (INTEGER, FOREIGN KEY)
route_id (INTEGER, FOREIGN KEY)
seats (TEXT - JSON array)
total_price (REAL)
booking_date (DATETIME)
status (TEXT)
```

#### contact_messages
```
id (INTEGER, PRIMARY KEY)
name (TEXT)
email (TEXT)
message (TEXT)
status (TEXT)
created_at (DATETIME)
```

### ⚙️ Configuration

Edit `.env` file to customize:
```env
PORT=5000                    # Server port
JWT_SECRET=your-secret-key   # Change this for production!
NODE_ENV=development         # or 'production'
```

### 🧪 Testing the Application

1. **Register a new user:**
   - Go to `http://localhost:5000/register.html`
   - Fill in name, email, password
   - Click Register

2. **Login:**
   - Go to `http://localhost:5000/login.html`
   - Use registered email and password
   - Click Login

3. **Search routes:**
   - On homepage, select "From" and "To" cities
   - Click Search Buses

4. **Book a ticket:**
   - Click "Book Now" on a route
   - Select seats
   - Click "Confirm Booking"
   - View booking confirmation with ID

5. **View booking history:**
   - Click "History" in navbar
   - See all your bookings

6. **Submit contact form:**
   - Go to Contact page
   - Fill form and submit

### 🔒 Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire after 24 hours
- Change JWT_SECRET in .env for production
- Use HTTPS in production
- Validate all inputs on both frontend and backend

### 📊 Sample Data

On first run, the system automatically creates:
- 10 sample bus routes between major cities
- 28 seats per route
- Some seats pre-booked for demonstration

### 🐛 Troubleshooting

**Port 5000 already in use:**
```bash
# Change PORT in .env to another port (e.g., 3000)
PORT=3000
```

**npm install fails:**
```bash
# Clear npm cache
npm cache clean --force
# Try install again
npm install
```

**Database error:**
```bash
# Delete the database and restart (data will be recreated)
rm data/easygo.db
npm start
```

**CORS issues:**
- Make sure server is running on http://localhost:5000
- Frontend should also be accessed from http://localhost:5000 (not file://)

### 📝 Frontend Integration

All HTML pages now include:
- `<script src="main-api.js"></script>` - API client functions
- Forms use `onsubmit` handlers that call API functions
- Data is stored in localStorage for user session
- JWT tokens are used for authenticated requests

### 🔄 API Request Example

```javascript
// Login example
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'user@example.com', 
    password: 'password123' 
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('current_user', JSON.stringify(data.user));
}
```

### 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile hamburger menu
- Optimized for all screen sizes
- Touch-friendly buttons and forms

### 🎯 Next Steps

1. Test all functionality in the browser
2. Create an admin panel for managing routes/seats
3. Integrate payment gateway
4. Add email notifications
5. Deploy to a hosting service

### 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors (F12)
3. Check server logs in terminal
4. Verify database is created in `data/easygo.db`

### 📄 License

This project is for educational purposes.

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Backend Type:** Node.js/Express with SQLite3
