# More Buses Added ✅

## What Changed

Updated `db.js` to include **50 routes total** instead of 10, with **at least 5 buses per route direction**.

### Before
- 10 total routes
- 1-2 buses per route direction
- Limited variety

### After
- 50 total routes (1,400 seats total)
- 5-6 buses per route direction
- Multiple departure times
- Varied pricing
- Different bus types

## Routes Added (50 Total)

### Dhaka ↔ Chittagong (6 buses)
- 06:00 AM - EasyGo Express - Tk. 500
- 08:30 AM - EasyGo Comfort - Tk. 500
- 11:00 AM - EasyGo Premium - Tk. 550
- 02:00 PM - EasyGo Standard - Tk. 500
- 04:30 PM - EasyGo Deluxe - Tk. 550
- 07:00 PM - EasyGo Night Express - Tk. 600

### Dhaka ↔ Barishal (5 buses)
- 07:00 AM - EasyGo Express - Tk. 450
- 10:00 AM - EasyGo Comfort - Tk. 450
- 01:00 PM - EasyGo Premium - Tk. 500
- 03:30 PM - EasyGo Standard - Tk. 450
- 06:00 PM - EasyGo Deluxe - Tk. 500

### Dhaka ↔ Sylhet (5 buses)
- 08:00 AM - EasyGo Express - Tk. 600
- 10:30 AM - EasyGo Comfort - Tk. 600
- 01:00 PM - EasyGo Premium - Tk. 650
- 04:00 PM - EasyGo Standard - Tk. 600
- 07:00 PM - EasyGo Deluxe - Tk. 650

### Chittagong ↔ Cox's Bazar (5 buses)
- 06:00 AM - EasyGo Express - Tk. 350
- 09:00 AM - EasyGo Comfort - Tk. 350
- 12:00 PM - EasyGo Premium - Tk. 400
- 02:00 PM - EasyGo Standard - Tk. 350
- 05:00 PM - EasyGo Deluxe - Tk. 400

### Dhaka ↔ Rajshahi (5 buses)
- 07:00 AM - EasyGo Express - Tk. 550
- 09:30 AM - EasyGo Comfort - Tk. 550
- 12:00 PM - EasyGo Premium - Tk. 600
- 02:30 PM - EasyGo Standard - Tk. 550
- 05:00 PM - EasyGo Deluxe - Tk. 600

### Dhaka ↔ Rangpur (5 buses)
- 06:30 AM - EasyGo Express - Tk. 450
- 09:00 AM - EasyGo Comfort - Tk. 450
- 11:30 AM - EasyGo Premium - Tk. 500
- 02:00 PM - EasyGo Standard - Tk. 450
- 04:30 PM - EasyGo Deluxe - Tk. 500

### Dhaka ↔ Bogura (5 buses)
- 07:00 AM - EasyGo Express - Tk. 400
- 10:00 AM - EasyGo Comfort - Tk. 400
- 01:00 PM - EasyGo Premium - Tk. 450
- 03:30 PM - EasyGo Standard - Tk. 400
- 06:00 PM - EasyGo Deluxe - Tk. 450

### Dhaka ↔ Kuakata (5 buses)
- 06:00 AM - EasyGo Express - Tk. 600
- 08:30 AM - EasyGo Comfort - Tk. 600
- 11:00 AM - EasyGo Premium - Tk. 650
- 02:00 PM - EasyGo Standard - Tk. 600
- 04:30 PM - EasyGo Deluxe - Tk. 650

### Dhaka ↔ Dinajpur (5 buses)
- 06:30 AM - EasyGo Express - Tk. 500
- 09:00 AM - EasyGo Comfort - Tk. 500
- 12:00 PM - EasyGo Premium - Tk. 550
- 02:30 PM - EasyGo Standard - Tk. 500
- 05:00 PM - EasyGo Deluxe - Tk. 550

### Dhaka ↔ Cumilla (5 buses)
- 07:00 AM - EasyGo Express - Tk. 400
- 09:30 AM - EasyGo Comfort - Tk. 400
- 12:00 PM - EasyGo Premium - Tk. 450
- 02:30 PM - EasyGo Standard - Tk. 400
- 05:00 PM - EasyGo Deluxe - Tk. 450

## How to Apply

### Step 1: Clean Database
```cmd
cd d:\Project\Online-ticket-Booking-Project-main
rmdir /s /q data
```

### Step 2: Restart Server
```cmd
npm start
```

The server will:
1. Create new database with fresh tables
2. Insert all 50 routes
3. Create 1,400 seats (28 per route)
4. Show: "Sample routes inserted (50 total routes)"

### Step 3: Test Search
1. Go to http://localhost:5000/homepage.html
2. Search: From **Dhaka** → To **Chittagong**
3. Click **SEARCH**
4. ✅ Should see 6 different bus options with various times and prices!

## Database Statistics

After restart:
- **Total Routes**: 50
- **Total Seats**: 1,400 (28 per route)
- **Routes per Direction**: 5-6
- **Departure Times**: Multiple (morning, afternoon, evening)
- **Bus Types**: 5 (Express, Comfort, Premium, Standard, Deluxe)
- **Price Range**: Tk. 350-650

## Verify in Database

```cmd
sqlite3 data\easygo.db "SELECT COUNT(*) as route_count FROM routes;"
```

Should show: **50**

Check routes for a specific search:
```cmd
sqlite3 data\easygo.db "SELECT bus_name, departure_time, price FROM routes WHERE from_city='Dhaka' AND to_city='Chittagong';"
```

Should show: **6 rows**

## Search Results Example

When user searches "Dhaka → Chittagong", they'll see:

```
Route 1: EasyGo Express, 06:00 AM, Tk. 500, 28 seats available
Route 2: EasyGo Comfort, 08:30 AM, Tk. 500, 28 seats available
Route 3: EasyGo Premium, 11:00 AM, Tk. 550, 28 seats available
Route 4: EasyGo Standard, 02:00 PM, Tk. 500, 28 seats available
Route 5: EasyGo Deluxe, 04:30 PM, Tk. 550, 28 seats available
Route 6: EasyGo Night Express, 07:00 PM, Tk. 600, 28 seats available
```

User can click **"Select & Choose Seats"** on any bus!

## Files Modified
- ✅ `db.js` - Updated insertSampleRoutes() with 50 routes

## Next Steps (Optional)

If you want even more buses, you can:
1. Add more time slots to existing routes
2. Add more route directions (e.g., Chittagong → Dhaka, reverse routes)
3. Modify prices for dynamic pricing
4. Add bus capacity variations

But with 50 routes (5-6 per search), you have plenty for demo!

---

**All set!** Delete `data/` folder and restart `npm start` to get all 50 buses in the system! 🚌🚌🚌
