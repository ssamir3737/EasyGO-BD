# EasyGo BD - Installation & Verification Guide

## ✅ Pre-Installation Checklist

- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Project folder accessible: `d:\Project\Online-ticket-Booking-Project-main`
- [ ] Read README.md for overview
- [ ] Read SETUP_GUIDE.md for detailed instructions

## 🚀 Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd d:\Project\Online-ticket-Booking-Project-main
```

### Step 2: Install Dependencies
```bash
npm install
```

Expected output:
```
added XXX packages in Xs
```

### Step 3: Verify Installation
```bash
npm list express sqlite3 bcryptjs jsonwebtoken
```

Should show all packages installed.

### Step 4: Start the Server
```bash
npm start
```

Expected output:
```
✓ Server running on http://localhost:5000
✓ API endpoints available at http://localhost:5000/api
✓ Frontend available at http://localhost:5000
```

### Step 5: Open in Browser
```
http://localhost:5000
```

You should see the EasyGo BD landing page with login form.

## 📋 Full Feature Testing Checklist

### Test 1: User Registration
- [ ] Click "Register" link on login page
- [ ] Fill in: Name, Email, Password, Confirm Password
- [ ] Click "Register" button
- [ ] Should redirect to login page
- [ ] Verify in database: `data/easygo.db`
```bash
# Check database
sqlite3 data/easygo.db
> SELECT * FROM users;
```

### Test 2: User Login
- [ ] Go to login page
- [ ] Enter registered email and password
- [ ] Click "Login" button
- [ ] Should redirect to homepage
- [ ] Check localStorage: 
  - auth_token (should exist)
  - current_user (should have user data)

### Test 3: Route Search
- [ ] On homepage, select "From" city (e.g., "Dhaka")
- [ ] Select "To" city (e.g., "Chittagong")
- [ ] Select a date
- [ ] Click "Search Buses"
- [ ] Should show available routes
- [ ] Verify routes come from database:
```bash
sqlite3 data/easygo.db
> SELECT * FROM routes WHERE from_city='Dhaka' AND to_city='Chittagong';
```

### Test 4: Seat Selection
- [ ] Click "Book Now" on a route
- [ ] Should load seat.html with available seats
- [ ] Verify seats come from database:
```bash
sqlite3 data/easygo.db
> SELECT * FROM seats WHERE route_id=1;
```
- [ ] Click multiple seats to select them
- [ ] Total price should update
- [ ] Booked seats should be disabled

### Test 5: Booking Creation
- [ ] Select multiple seats (e.g., A1, A2, B1)
- [ ] Click "Continue"
- [ ] Should create booking in database
- [ ] Verify booking record:
```bash
sqlite3 data/easygo.db
> SELECT * FROM bookings;
```
- [ ] Verify seats marked as booked:
```bash
> SELECT * FROM seats WHERE status='booked';
```

### Test 6: Booking Confirmation
- [ ] After booking, should see confirmation page
- [ ] Display should show:
  - [ ] Booking ID (format: EGB + timestamp)
  - [ ] Route details (from, to, time)
  - [ ] Selected seats list
  - [ ] Total price
  - [ ] Passenger name and email

### Test 7: Booking History
- [ ] Click "History" in navbar
- [ ] Should display all past bookings
- [ ] Click a booking to see details
- [ ] Verify from database:
```bash
sqlite3 data/easygo.db
> SELECT b.*, r.from_city, r.to_city FROM bookings b 
  JOIN routes r ON b.route_id = r.id;
```

### Test 8: Contact Form
- [ ] Go to Contact Us page
- [ ] Fill in: Name, Email, Message
- [ ] Click "Send Message"
- [ ] Should show success message
- [ ] Verify in database:
```bash
sqlite3 data/easygo.db
> SELECT * FROM contact_messages;
```

### Test 9: Logout
- [ ] Click "Logout" button
- [ ] Should redirect to home page
- [ ] localStorage should be cleared
- [ ] Check browser DevTools:
  - Press F12 → Application → localStorage
  - Should see no auth_token or current_user

### Test 10: API Health Check
- [ ] Open in browser: `http://localhost:5000/api/health`
- [ ] Should return JSON: `{"status":"Server is running","timestamp":"2024-..."}`

## 🗄️ Database Verification

### Check All Tables Created
```bash
sqlite3 data/easygo.db
> .tables
```
Should show: `bookings contact_messages routes seats users`

### Check Sample Data
```bash
sqlite3 data/easygo.db
> SELECT COUNT(*) FROM users;        # Should show users
> SELECT COUNT(*) FROM routes;       # Should show 10
> SELECT COUNT(*) FROM seats;        # Should show 280 (10 routes × 28 seats)
> SELECT COUNT(*) FROM bookings;     # Depends on your bookings
> SELECT COUNT(*) FROM contact_messages; # Depends on contact forms
```

### Verify Data Integrity
```bash
# Check foreign key constraints work
sqlite3 data/easygo.db
> PRAGMA foreign_keys=ON;
> SELECT * FROM bookings;  # Should only reference existing users and routes
```

## 🔐 Security Verification

### Test 1: Password Hashing
```bash
sqlite3 data/easygo.db
> SELECT email, password FROM users LIMIT 1;
```
Password should be a long hash (bcrypt format), NOT plain text.

### Test 2: JWT Token
- [ ] Login and get JWT token
- [ ] Open DevTools (F12) → Application → localStorage
- [ ] Copy auth_token value
- [ ] Decode at: https://jwt.io (paste token)
- [ ] Should show: `{ id: X, email: "user@example.com", exp: XXXXXXXXX }`

### Test 3: Token Expiry
- [ ] Login to get token
- [ ] Token expires in 24 hours
- [ ] After expiry, booking should fail (401 Unauthorized)

### Test 4: Input Validation
- [ ] Try registering with weak password (< 6 chars)
- [ ] Should show error message
- [ ] Try registering with existing email
- [ ] Should show error message

## 🐛 Troubleshooting

### Issue: Port 5000 Already in Use
```bash
# Solution: Change PORT in .env
PORT=3000
npm start
# Then open http://localhost:3000
```

### Issue: npm install fails
```bash
# Solution:
npm cache clean --force
npm install
```

### Issue: Database Connection Error
```bash
# Solution: Delete and recreate database
rm data/easygo.db
npm start
# Database will be auto-created with fresh data
```

### Issue: CORS Error in Browser
- Ensure server is running on correct port
- Check browser console (F12) for exact error
- Verify frontend HTML is loading from correct URL

### Issue: Routes not loading
- Check network tab (F12) for API responses
- Verify database has routes: `SELECT * FROM routes;`
- Check server logs for errors

### Issue: Booking fails with error
- Check all selected seats are available
- Verify user is logged in (auth token exists)
- Check database has space for booking

## ✅ Success Indicators

After complete setup, you should have:

✅ **Server Running**
- Terminal shows: "✓ Server running on http://localhost:5000"
- No error messages in server logs

✅ **Database Created**
- File exists: `data/easygo.db`
- All 5 tables present
- Sample routes with seats loaded

✅ **Frontend Working**
- All pages load without errors
- Navigation between pages works
- Forms accept input

✅ **Authentication Working**
- Can register new users
- Can login with registered credentials
- JWT tokens generated
- Tokens stored in localStorage

✅ **Search Working**
- Can search routes
- Results show from database
- Route details display correctly

✅ **Booking Working**
- Can select seats
- Can create bookings
- Booking ID generated
- Seats marked as booked in database

✅ **History Working**
- Can view booking history
- Shows all user's bookings
- Booking details accurate

✅ **Contact Working**
- Can submit contact form
- Messages saved to database
- Confirmation message shown

## 📊 Sample Test Data

After first `npm start`, system creates:
- 10 sample bus routes
- 28 seats per route
- Some pre-booked seats
- Ready for testing

Example routes:
```
Dhaka → Chittagong (6:00 AM, ৳500)
Dhaka → Chittagong (2:00 PM, ৳500)
Dhaka → Barishal (7:00 AM, ৳450)
Dhaka → Barishal (3:00 PM, ৳450)
Dhaka → Sylhet (8:00 AM, ৳600)
...and more
```

## 🔍 Manual Testing Commands

### Test API Directly with curl

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123","confirmPassword":"test123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test route search
curl http://localhost:5000/api/routes/search?from=Dhaka&to=Chittagong

# Test seats
curl http://localhost:5000/api/seats/1
```

## 📝 Test Report Template

```
Test Report - EasyGo BD
Date: [Date]
Tester: [Name]
Backend: Node.js/Express
Database: SQLite3
Server: http://localhost:5000

✅ Registration: PASS/FAIL
✅ Login: PASS/FAIL
✅ Route Search: PASS/FAIL
✅ Seat Selection: PASS/FAIL
✅ Booking Creation: PASS/FAIL
✅ Booking Confirmation: PASS/FAIL
✅ Booking History: PASS/FAIL
✅ Contact Form: PASS/FAIL
✅ Logout: PASS/FAIL
✅ Database Integrity: PASS/FAIL
✅ Security (Password Hashing): PASS/FAIL
✅ Security (JWT Tokens): PASS/FAIL

Notes:
[Add any observations or issues]
```

## 🎉 Congratulations!

If all tests pass, your complete backend-integrated ticket booking system is ready for:
- ✅ Development
- ✅ Testing
- ✅ Demonstration
- ✅ Deployment

Enjoy your fully functional EasyGo BD system! 🚀
