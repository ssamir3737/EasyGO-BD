# Complete Admin Panel System ✅

## Admin Panel Features

### 1. **Login Choice Page** (login-choice.html)
- First page users see before logging in
- Two options:
  - 👤 **User Login** - For regular ticket booking users
  - ⚙️ **Admin Login** - For administrators

### 2. **Admin Login Page** (admin-login.html)
- Secure admin authentication
- Default credentials: **admin@email.com / 12345678**
- Red gradient theme (admin specific)
- Error message display
- Back button to login choice

### 3. **Admin Dashboard** (admin-dashboard.html)
- Complete admin control panel
- **Sidebar Menu**:
  - 📊 Dashboard
  - 🚌 Manage Buses
  - 📋 View Bookings
  - 👥 Manage Users
  - 🚪 Logout

#### Dashboard Overview
- **📊 Dashboard Card** - Total Routes
- **📋 Booking Card** - Total Bookings
- **💰 Revenue Card** - Total Revenue
- **👥 Users Card** - Registered Users
- **Recent Bookings Table** - Latest 10 bookings

#### Bus Management
- ➕ **Add New Route Form**:
  - From City
  - To City
  - Departure Time
  - Price (Tk.)
  - Bus Name
  - Total Seats (default 36)
  
- 📍 **Routes List Table**:
  - Show all routes
  - Available seats
  - Delete button for each route

#### Booking Management
- 📋 **All Bookings Table**:
  - Booking ID
  - User Email
  - Route
  - Seats
  - Total Price
  - Status
  - Booking Date

#### User Management
- 👥 **Registered Users Table**:
  - User ID
  - Name
  - Email
  - Total Bookings
  - Join Date

---

## Database Changes

### Users Table
Added `role` column:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',  -- NEW: 'user' or 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Default Admin User
Automatically created on first run:
- **Email**: admin@easygo.com
- **Password**: admin123
- **Role**: admin

---

## API Endpoints (New)

### Admin Authentication
```
POST /api/admin/login
Request:
{
  "email": "admin@easygo.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "admin": {
    "id": 1,
    "name": "EasyGo Admin",
    "email": "admin@easygo.com",
    "role": "admin"
  }
}
```

### Dashboard Statistics
```
GET /api/admin/dashboard
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "stats": {
    "totalRoutes": 50,
    "totalBookings": 25,
    "totalRevenue": 12500,
    "totalUsers": 10
  }
}
```

### Routes Management
```
GET /api/admin/routes
POST /api/admin/routes/add
DELETE /api/admin/routes/delete/{routeId}

POST /api/admin/routes/add
Request:
{
  "from_city": "Dhaka",
  "to_city": "Sylhet",
  "departure_time": "14:30",
  "price": 550,
  "bus_name": "EasyGo Premium",
  "total_seats": 36
}
```

### Bookings Management
```
GET /api/admin/bookings
GET /api/admin/bookings/recent
```

### Users Management
```
GET /api/admin/users
```

---

## Files Created/Modified

### Created
✅ **login-choice.html** - Login selection page (4KB)
✅ **admin-login.html** - Admin login page (7KB)
✅ **admin-dashboard.html** - Admin panel (27KB)
✅ **admin-api.js** - Admin API endpoints (7KB)

### Modified
✅ **db.js** - Added role column, default admin user
✅ **server.js** - Added admin routes, token verification
✅ **main-api.js** - No changes needed

---

## How to Use Admin Panel

### Step 1: Access Admin Login
1. Go to http://localhost:5000
2. Click "Login as Admin" option

### Step 2: Login
- Email: `admin@easygo.com`
- Password: `admin123`

### Step 3: Admin Dashboard
View and manage:
- 📊 Overview statistics
- 🚌 Add/Delete routes
- 📋 View all bookings
- 👥 View users

### Add New Route
1. Click "🚌 Manage Buses"
2. Fill form:
   - From City: Dhaka
   - To City: Khulna
   - Departure Time: 09:00 AM
   - Price: 600
   - Bus Name: EasyGo Luxury
   - Total Seats: 36
3. Click "✓ Add Route"

### Delete Route
1. Click "🚌 Manage Buses"
2. Find route in table
3. Click "Delete" button
4. Confirm deletion

---

## Security Features

✅ JWT Authentication for admin
✅ Token verification on all admin endpoints
✅ Role-based access control (admin vs user)
✅ Password hashing with bcryptjs
✅ Admin token expires in 24 hours
✅ API endpoints check admin role

---

## User Flow (Unchanged)

Regular users still follow the original flow:
1. Go to http://localhost:5000
2. Click "Login as User"
3. Login/Register
4. Search routes
5. Book tickets
6. Make payment
7. View receipt

---

## Testing Checklist

✅ Admin can login with correct credentials
✅ Admin dashboard loads statistics
✅ Admin can add new routes
✅ Admin can delete routes
✅ Admin can view all bookings
✅ Admin can view all users
✅ Users cannot access admin panel
✅ Session persists after page refresh
✅ Logout clears tokens
✅ Routes sync between admin and user pages

---

## Default Admin Credentials

**Email**: admin@easygo.com
**Password**: admin123

⚠️ **IMPORTANT**: Change these credentials in production!

---

## Architecture

```
Frontend (HTML/CSS/JS)
    ↓
Admin Dashboard (admin-dashboard.html)
    ↓
Admin API (admin-api.js)
    ↓
Server Routes (server.js)
    ↓
Database (SQLite3)
```

---

## Complete User Journey

### As Admin
```
login-choice.html
    ↓
admin-login.html (Email + Password)
    ↓
admin-dashboard.html (Control Panel)
    ├─ Dashboard (View stats)
    ├─ Manage Buses (Add/Delete routes)
    ├─ View Bookings (See all bookings)
    └─ Manage Users (View users)
```

### As User
```
login-choice.html
    ↓
login.html (Register/Login)
    ↓
homepage.html (Search routes)
    ↓
seat.html (Select seats)
    ↓
payment.html (Make payment)
    ↓
booking.html (Receipt)
```

---

**Admin system is fully operational!** 🎉
