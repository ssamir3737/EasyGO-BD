# Test API Directly (Without Browser)

If the browser registration isn't working, test the API directly using these commands.

## Test 1: Check Server is Running

```cmd
curl -X GET http://localhost:5000/api/health
```

**Expected response:**
```json
{"status":"Server is running","timestamp":"2026-04-14T..."}
```

If you don't get a response, the server isn't running or not listening.

## Test 2: Register User via Command Line

```cmd
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}"
```

**Expected response (success):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Expected response (if email exists):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Expected response (if passwords don't match):**
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

## Test 3: Login with Registered User

```cmd
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**Expected response (success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Test 4: Search Routes

```cmd
curl -X GET "http://localhost:5000/api/routes/search?from=Dhaka&to=Chittagong"
```

**Expected response:**
```json
{
  "success": true,
  "routes": [
    {
      "id": 1,
      "from_city": "Dhaka",
      "to_city": "Chittagong",
      "departure_time": "08:00 AM",
      "price": 500,
      "total_seats": 28,
      "bus_name": "EasyGo Express"
    }
  ]
}
```

## Test 5: Get Seats for Route

```cmd
curl -X GET http://localhost:5000/api/seats/1
```

**Expected response:**
```json
{
  "success": true,
  "seats": [
    {
      "id": 1,
      "route_id": 1,
      "seat_label": "A1",
      "status": "available",
      "booked_by": null
    },
    {
      "id": 2,
      "route_id": 1,
      "seat_label": "A2",
      "status": "available",
      "booked_by": null
    }
  ]
}
```

## If Tests Fail

### Error 1: "Connection refused"
- Server is not running
- Run `npm start` again

### Error 2: Wrong response format
- API code has issues
- Check server console for errors

### Error 3: "All fields are required"
- Request body not being parsed
- Verify field names are exact: name, email, password, confirmPassword

### Error 4: Database errors
- Database not initialized
- Run: `rmdir /s /q data && npm start`

## Expected Data After First Start

After running the commands above, the database should have:
- 1 user (john@example.com)
- 10 routes (pre-seeded: Dhaka-Chittagong, Dhaka-Cox, etc.)
- 280 seats (28 per route)

Check with:
```cmd
sqlite3 data\easygo.db "SELECT COUNT(*) as user_count FROM users;"
sqlite3 data\easygo.db "SELECT COUNT(*) as route_count FROM routes;"
sqlite3 data\easygo.db "SELECT COUNT(*) as seat_count FROM seats;"
```

## Using PowerShell Instead of CMD

If using PowerShell, escape the JSON differently:

```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
    confirmPassword = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

## Summary

- If all curl commands work → Problem is in browser/frontend
- If registration curl fails → Problem is in backend API
- If no response → Server not running or wrong port

Please run these tests and share the outputs!
