# Bus Seat Layout Updated ✅

## New Layout Design

Instead of 7 rows × 4 columns (28 seats), now using:

**9 rows × 4 columns = 36 seats**

```
          DRIVER
            👷
┌──────────────────────────────┐
│ A1   A2  |AISLE|  A3   A4    │
│ B1   B2  |AISLE|  B3   B4    │
│ C1   C2  |AISLE|  C3   C4    │
│ D1   D2  |AISLE|  D3   D4    │
│ E1   E2  |AISLE|  E3   E4    │
│ F1   F2  |AISLE|  F3   F4    │
│ G1   G2  |AISLE|  G3   G4    │
│ H1   H2  |AISLE|  H3   H4    │
│ I1   I2  |AISLE|  I3   I4    │
└──────────────────────────────┘
```

---

## Files Updated

### 1. **main-api.js** ✅
- **Line 252**: Changed rows from 7 (A-G) to 9 (A-I)
- Layout structure remains: 2 seats | AISLE | 2 seats

### 2. **db.js** ✅
- **Line 214**: Seat creation loop changed from 7 rows to 9 rows
- **Line 192**: Total seats increased from 28 to 36

### 3. **styles/style.css** ✅
- **.seats**: Changed from grid to flexbox layout
- **.seat-row**: Added flexbox styling for proper row alignment
- **.seat**: Added width/height (50px) and proper styling
- **.seat:hover**: Added hover effect
- **.seat.booked**: Added styling for booked seats
- **.aisle**: Updated width and height for proper spacing
- **.seat.selected**: Kept selection styling

---

## Layout Features

✅ **2-2 Layout**: [Seat] [Seat] **AISLE** [Seat] [Seat]
✅ **9 Rows**: A through I
✅ **Middle Aisle**: Separates left 2 seats from right 2 seats
✅ **Hover Effect**: Seats change color on hover
✅ **Visual Feedback**: Selected seats show dark color
✅ **Booked Seats**: Show as grayed out and disabled

---

## How It Looks

| Seat State | Color | Interaction |
|-----------|-------|------------|
| Available | Light Teal | Click to select |
| Hover | Darker Teal | Shows feedback |
| Selected | Dark Blue | ✓ Highlighted |
| Booked | Gray | ✗ Disabled |

---

## What Changed

**Before**: 
- 7 rows (A-G) × 4 columns = 28 seats
- 3-column grid layout

**After**:
- 9 rows (A-I) × 4 columns = 36 seats
- Flexbox layout with aisle in middle
- Better visual organization
- Matches bus seat layout design

---

## Next Steps: IMPORTANT!

### Delete old database to recreate with 36 seats:

**In PowerShell/CMD:**
```bash
cd D:\Project\Online-ticket-Booking-Project-main
rmdir /s data
npm start
```

Or manually:
1. Delete the `data` folder in project root
2. Run `npm start`
3. Server will recreate database with 36 seats per route
4. Go to http://localhost:5000

---

## Test the New Layout

1. Start server: `npm start`
2. Go to: http://localhost:5000
3. Search for routes
4. Click "Select & Choose Seats"
5. ✅ Should see 9 rows of seats with aisle in middle
6. ✅ Hover over seats to see effect
7. ✅ Click seats to select (max 5 per journey)
8. ✅ Booked seats should be gray and disabled

---

## Code Changes Summary

**main-api.js Line 252:**
```javascript
// Before: const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
// After:
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
```

**db.js Line 214:**
```javascript
// Before: for (let row = 0; row < 7; row++) {
// After:
for (let row = 0; row < 9; row++) {
```

**db.js Line 192:**
```javascript
// Before: stmt.run(route.from, route.to, route.time, route.price, route.bus, 28, ...);
// After:
stmt.run(route.from, route.to, route.time, route.price, route.bus, 36, ...);
```

---

Perfect! Bus seat layout is now organized like the design you provided. 🚌
