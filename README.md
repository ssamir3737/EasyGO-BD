# EasyGo BD - Online Ticket Booking System

## 🎯 Project Overview

EasyGo BD is a complete online bus ticket booking system with a modern frontend and a robust backend. Users can search for bus routes, book tickets by selecting seats, view booking history, and contact support.

## ✨ Features

### User Management
- ✅ User registration with email verification
- ✅ Secure login with JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ Persistent user sessions

### Ticket Booking
- ✅ Search bus routes by origin and destination
- ✅ Interactive seat selection with real-time pricing
- ✅ Unique booking ID generation
- ✅ Booking confirmation with details
- ✅ Complete booking history

### Database
- ✅ SQLite3 persistent storage
- ✅ Automatic database initialization
- ✅ Sample route data pre-loaded
- ✅ Transaction-based seat booking

### API
- ✅ RESTful API with Express.js
- ✅ Complete CRUD operations
- ✅ Error handling and validation
- ✅ CORS enabled for cross-domain requests

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

Server will run on `http://localhost:5000`

### 3. Open in Browser
Navigate to: `http://localhost:5000`

## 📁 Project Structure

```
├── server.js              # Main Express server
├── db.js                  # Database setup & initialization
├── api.js                 # All API route handlers
├── main-api.js           # Frontend API client functions
├── package.json          # Dependencies
├── .env                  # Environment config
├── data/
│   └── easygo.db        # SQLite database
├── HTML Pages/
│   ├── index.html       # Landing page
│   ├── login.html       # Login page
│   ├── register.html    # Registration
│   ├── homepage.html    # Search page
│   ├── search.html      # Results
│   ├── seat.html        # Seat selection
│   ├── booking.html     # Confirmation
│   ├── history.html     # Booking history
│   └── contact.html     # Contact form
├── styles/
│   └── style.css        # Main stylesheet
└── image/               # Images folder
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### Routes
- `GET /api/routes/search?from=X&to=Y` - Search routes
- `GET /api/routes` - Get all routes

### Seats
- `GET /api/seats/:routeId` - Get available seats

### Bookings
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/history/:userId` - Get user bookings
- `GET /api/bookings/:bookingId` - Get booking details

### Contact
- `POST /api/contact/submit` - Submit contact message

## 🗄️ Database Schema

### users
- id, name, email, password (hashed), created_at

### routes
- id, from_city, to_city, departure_time, price, total_seats, bus_name, created_at

### seats
- id, route_id, seat_label, status (available/booked), booked_by

### bookings
- id, booking_id, user_id, route_id, seats (JSON), total_price, booking_date, status

### contact_messages
- id, name, email, message, status, created_at

## 📊 Sample Data

On first startup, the system auto-creates:
- 10 sample bus routes
- 28 seats per route
- Some pre-booked seats for demo

## 🔐 Security Features

- Passwords hashed with bcryptjs
- JWT tokens for authentication (24-hour expiry)
- Input validation on frontend and backend
- Transaction-based database operations
- CORS enabled only for localhost

## 🧪 Testing the System

### 1. Register a New User
- Go to Register page
- Fill in credentials
- Click Register

### 2. Login
- Use registered email and password
- Click Login

### 3. Search & Book
- Select From and To cities
- Choose a date
- Click Search
- Select a route
- Choose seats
- Confirm booking

### 4. View History
- Click History in navbar
- See all your bookings

### 5. Contact Support
- Go to Contact page
- Fill form and submit

## ⚙️ Configuration

Edit `.env` to customize:
```env
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 🐛 Troubleshooting

**Port 5000 already in use:**
```bash
# Change PORT in .env
PORT=3000
```

**npm install fails:**
```bash
npm cache clean --force
npm install
```

**Database errors:**
```bash
# Remove database and restart
rm data/easygo.db
npm start
```

## 📈 Future Enhancements

- Payment gateway integration
- Email notifications
- Admin dashboard
- Real-time seat updates
- Mobile app
- Multi-language support

## 📞 Support

For issues or questions, refer to SETUP_GUIDE.md for detailed documentation.

## 📄 License

Educational project - Free to use and modify.

---

**Version:** 1.0.0  
**Backend:** Node.js/Express  
**Database:** SQLite3  
**Last Updated:** 2024
