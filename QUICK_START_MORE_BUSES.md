# ✅ 50 Buses Ready - Quick Start Guide

## What's New
- **50 total routes** (was 10)
- **5-6 buses per search** (was 1-2)
- **1,400 total seats** (was 280)
- Multiple departure times and prices

## How to Apply (3 Steps)

### Step 1: Delete Old Database
```cmd
cd d:\Project\Online-ticket-Booking-Project-main
rmdir /s /q data
taskkill /IM node.exe /F
```

### Step 2: Start Server
```cmd
npm start
```

Wait for:
```
✓ Sample routes inserted (50 total routes)
✓ Seats created for all routes
```

### Step 3: Test It

Go to: `http://localhost:5000/homepage.html`

**Search:**
- From: **Dhaka**
- To: **Chittagong**
- Date: **Any date**

**Result:** See **6 buses** with different times and prices!

## Sample Results

```
🚌 EasyGo Express - 06:00 AM - Tk. 500
🚌 EasyGo Comfort - 08:30 AM - Tk. 500
🚌 EasyGo Premium - 11:00 AM - Tk. 550
🚌 EasyGo Standard - 02:00 PM - Tk. 500
🚌 EasyGo Deluxe - 04:30 PM - Tk. 550
🚌 EasyGo Night Express - 07:00 PM - Tk. 600
```

Click any bus → Select seats → Complete booking!

## Available Route Pairs

1. **Dhaka ↔ Chittagong** - 6 buses
2. **Dhaka ↔ Barishal** - 5 buses
3. **Dhaka ↔ Sylhet** - 5 buses
4. **Chittagong ↔ Cox's Bazar** - 5 buses
5. **Dhaka ↔ Rajshahi** - 5 buses
6. **Dhaka ↔ Rangpur** - 5 buses
7. **Dhaka ↔ Bogura** - 5 buses
8. **Dhaka ↔ Kuakata** - 5 buses
9. **Dhaka ↔ Dinajpur** - 5 buses
10. **Dhaka ↔ Cumilla** - 5 buses

**Total: 50 routes**

## Price Range
- Minimum: Tk. 350 (Short routes like Cox's Bazar)
- Maximum: Tk. 650 (Long routes like Kuakata, Sylhet)
- Most routes: Tk. 400-600

## Testing Checklist

- [ ] Delete `data/` folder
- [ ] Run `npm start`
- [ ] See "50 total routes" message
- [ ] Login/Register
- [ ] Search Dhaka → Chittagong
- [ ] See 6 bus options
- [ ] Click "Select & Choose Seats"
- [ ] Select seats
- [ ] Complete booking
- [ ] Check booking history

All working? ✅ System is complete!

## File Changed
- `db.js` - Updated sample routes (50 buses added)

No changes needed to HTML or other files!

---

Ready to test? Delete `data/` and restart! 🚀
