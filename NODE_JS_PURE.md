# 🎫 EasyGo BD - Pure Node.js Backend (No Express)

## ✨ What Changed

✅ **Removed Express.js** - Using pure Node.js `http` module
✅ **Removed all Express dependencies** - Lighter weight
✅ **Same functionality** - All 16 API endpoints work the same
✅ **Better performance** - Direct Node.js server
✅ **Simpler setup** - Fewer dependencies to install

---

## 🚀 Quick Start

### Step 1: Use CMD (Not PowerShell)
```cmd
cd d:\Project\Online-ticket-Booking-Project-main
```

### Step 2: Install Dependencies (Much Fewer Now!)
```cmd
npm install
```

This will install only:
- sqlite3 (database)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- dotenv (configuration)

### Step 3: Start the Server
```cmd
npm start
```

**Expected Output:**
```
✓ Server running on http://localhost:5000
✓ API endpoints available at http://localhost:5000/api
✓ Frontend available at http://localhost:5000
```

### Step 4: Open Browser
```
http://localhost:5000
```

---

## 📊 Pure Node.js Architecture

```
Client → HTTP Request
           ↓
        server.js (http.createServer)
           ↓
        URL Routing
           ↓
      api.js Handlers
           ↓
      db.js (SQLite)
           ↓
        Database
```

**No middleware framework needed!**

---

## 🔌 API Endpoints (Unchanged)

All 16 endpoints work exactly the same:

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/verify`

### Routes
- GET `/api/routes/search?from=X&to=Y`
- GET `/api/routes`

### Seats
- GET `/api/seats/:routeId`

### Bookings
- POST `/api/bookings/create`
- GET `/api/bookings/history/:userId`
- GET `/api/bookings/:bookingId`

### Contact
- POST `/api/contact/submit`

### Health
- GET `/api/health`

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `server.js` | Pure Node.js HTTP server |
| `api.js` | API handler functions |
| `db.js` | SQLite database setup |
| `main-api.js` | Frontend API client (unchanged) |
| `package.json` | Only essential dependencies |
| `.env` | Configuration |

---

## 🗄️ Database (Unchanged)

Same 5 tables:
- users
- routes
- seats
- bookings
- contact_messages

Auto-creates on first run with sample data.

---

## ✅ Advantages of Pure Node.js

✅ **Lighter Weight** - No Express overhead
✅ **Faster** - Direct HTTP server
✅ **Fewer Dependencies** - Only essentials
✅ **Smaller Download** - Less npm packages
✅ **Lower Memory** - Minimal framework
✅ **Full Control** - Know exactly what's happening

---

## 🚀 Usage Commands

### Install
```cmd
npm install
```

### Start Server
```cmd
npm start
```

### Development Mode (Auto-reload)
```cmd
npm run dev
```

### Stop Server
```cmd
Ctrl + C
```

---

## 📊 Comparison

| Feature | Express | Pure Node.js |
|---------|---------|--------------|
| Setup | Complex | Simple |
| Dependencies | Many | Few |
| Learning | Framework | Core Node.js |
| Performance | Good | Better |
| Memory | Higher | Lower |
| Control | Limited | Full |

---

## 🔐 Security Features (Same)

✅ Password hashing (bcryptjs)
✅ JWT authentication
✅ Input validation
✅ SQL injection prevention
✅ Transaction support
✅ CORS headers

---

## 🧪 Testing (Unchanged)

All features work the same:
- Register users
- Login with JWT
- Search routes
- Book tickets
- View history
- Submit contact forms

---

## 📝 Configuration

Edit `.env`:
```env
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### npm not found
→ Use **CMD** instead of PowerShell

### Port already in use
```bash
# Change in .env
PORT=3000
npm start
```

### Database errors
```bash
# Delete and recreate
rm data/easygo.db
npm start
```

---

## 🎯 What's Next?

1. **Run:** `npm start`
2. **Test:** All features work the same as before
3. **Develop:** Add new features if needed
4. **Deploy:** Same deployment process

---

## 📚 Documentation

Same documentation files apply:
- README.md (this file)
- SETUP_GUIDE.md
- TESTING_GUIDE.md
- ARCHITECTURE.md
- QUICK_REFERENCE.md

---

## 🎉 Ready!

**Just run:**
```cmd
npm install
npm start
```

Then visit: `http://localhost:5000`

Your pure Node.js ticket booking system is ready! 🚀

---

**Benefits:**
✅ Simpler code
✅ No framework overhead
✅ Full Node.js control
✅ Same functionality
✅ Better performance
