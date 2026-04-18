# Quick Reference Guide - EasyGo BD

## 🚀 Quick Start (2 minutes)

```bash
cd d:\Project\Online-ticket-Booking-Project-main
npm install
npm start
```

Then open: `http://localhost:5000`

## 📁 Important Files

| File | Purpose |
|------|---------|
| `server.js` | Express server configuration |
| `db.js` | Database setup & initialization |
| `api.js` | All API endpoints |
| `main-api.js` | Frontend API client functions |
| `package.json` | Dependencies |
| `.env` | Configuration |
| `data/easygo.db` | SQLite database |

## 📚 Documentation

| Document | Contents |
|----------|----------|
| `README.md` | Project overview |
| `SETUP_GUIDE.md` | Detailed installation |
| `TESTING_GUIDE.md` | Test procedures |
| `ARCHITECTURE.md` | System design diagrams |
| `IMPLEMENTATION_SUMMARY.md` | What was built |

## 🔌 Quick API Reference

### Authentication
```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify
```

### Routes
```javascript
GET /api/routes/search?from=Dhaka&to=Chittagong
GET /api/routes
```

### Seats
```javascript
GET /api/seats/:routeId
```

### Bookings
```javascript
POST /api/bookings/create
GET /api/bookings/history/:userId
GET /api/bookings/:bookingId
```

### Contact
```javascript
POST /api/contact/submit
```

## 🔑 Environment Variables (.env)

```env
PORT=5000
JWT_SECRET=easygo-ticket-booking-secret-key-2024
NODE_ENV=development
```

## 📊 Database Tables

```sql
users (id, name, email, password, created_at)
routes (id, from_city, to_city, departure_time, price, total_seats, bus_name, created_at)
seats (id, route_id, seat_label, status, booked_by)
bookings (id, booking_id, user_id, route_id, seats, total_price, booking_date, status)
contact_messages (id, name, email, message, status, created_at)
```

## 🧪 Test Data (Auto-Created)

- 10 sample routes
- 28 seats per route
- Some pre-booked seats

## 🔐 Security Features

✅ Password hashing (bcryptjs)
✅ JWT authentication (24h expiry)
✅ Input validation
✅ SQL injection prevention
✅ CORS enabled
✅ Transaction-based operations

## 📱 Frontend Pages

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `/` | Login |
| Register | `/register.html` | New user signup |
| Homepage | `/homepage.html` | Search routes |
| Search Results | `/search.html` | Show routes |
| Seat Selection | `/seat.html` | Choose seats |
| Confirmation | `/booking.html` | Booking details |
| History | `/history.html` | Past bookings |
| Contact | `/contact.html` | Support form |

## 🛠️ Common Commands

```bash
# Start server
npm start

# Start with auto-reload
npm run dev

# Check dependencies
npm list

# Clear cache
npm cache clean --force

# Access database
sqlite3 data/easygo.db

# View all tables
sqlite3 data/easygo.db ".tables"

# View table schema
sqlite3 data/easygo.db ".schema users"
```

## 🔍 Database Queries

```bash
sqlite3 data/easygo.db

# View users
SELECT * FROM users;

# View routes
SELECT * FROM routes;

# View bookings with route details
SELECT b.*, r.from_city, r.to_city 
FROM bookings b 
JOIN routes r ON b.route_id = r.id;

# View seat availability
SELECT * FROM seats WHERE route_id=1 AND status='available';

# View contact messages
SELECT * FROM contact_messages;

# Count records
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'routes', COUNT(*) FROM routes
UNION ALL
SELECT 'seats', COUNT(*) FROM seats
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings;
```

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env to 3000 |
| npm install fails | `npm cache clean --force && npm install` |
| Database error | `rm data/easygo.db && npm start` |
| CORS error | Ensure using localhost:5000, not file:// |
| Login fails | Check email exists in database |
| Booking fails | Verify user logged in (JWT token) |

## 📊 User Flow

```
Register → Login → Search Routes → Select Seats → Book Ticket → Confirmation → View History
```

## 🎯 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔑 Authentication Header

```javascript
// Include JWT token in API requests
Authorization: Bearer <jwt_token>
```

## 📈 Performance Tips

1. Database indexed on foreign keys
2. Use JWT tokens (no session DB queries)
3. Parameterized queries (prevent SQL injection)
4. Transactions for booking (atomic operations)
5. CORS caching enabled

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Set NODE_ENV=production
- [ ] Use strong passwords
- [ ] Enable HTTPS
- [ ] Set up automated backups
- [ ] Monitor server logs
- [ ] Test all functionality

## 📞 Support Resources

- **README.md** - Overview
- **SETUP_GUIDE.md** - Installation steps
- **TESTING_GUIDE.md** - How to test
- **ARCHITECTURE.md** - System design
- **IMPLEMENTATION_SUMMARY.md** - What's built

## 🎉 Success Indicators

✅ Server runs without errors
✅ Database created with all tables
✅ Can register and login
✅ Routes load from database
✅ Can book tickets
✅ Booking history works
✅ Contact form saves data

## 🔗 URLs Reference

| URL | Purpose |
|-----|---------|
| http://localhost:5000 | Landing page |
| http://localhost:5000/homepage.html | Search page |
| http://localhost:5000/api/health | Server health |
| http://localhost:5000/api/routes | All routes |

## 💡 Pro Tips

1. Use DevTools (F12) to inspect network calls
2. Check localStorage to see stored tokens
3. Use database UI tools (e.g., DBeaver) for SQLite
4. Test APIs with Postman or curl
5. Check server logs for debugging

## 📝 Notes

- Database auto-created on first run
- Sample data auto-seeded
- JWT tokens expire after 24 hours
- Passwords never stored in plain text
- Bookings use transactions for safety

---

**Need help?** Check the comprehensive guides in the project folder!
