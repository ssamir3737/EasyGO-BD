# Diagnostic Steps to Fix Registration Error

The error persists, so let's gather detailed information to identify the exact problem.

## Step 1: Kill Any Previous Node Process

Open CMD and run:
```cmd
taskkill /IM node.exe /F
timeout /t 2
```

## Step 2: Clear Old Data and Install Fresh

```cmd
cd d:\Project\Online-ticket-Booking-Project-main
rmdir /s /q data
rmdir /s /q node_modules
npm install
```

## Step 3: Start Server with Logging

```cmd
npm start
```

Look at the console output - you should see:
```
✓ Server running on http://localhost:5000
✓ Database connected
✓ Users table created
✓ Routes table created
✓ Seats table created
✓ API endpoints available
```

**If you don't see these messages, there's a setup issue. Screenshot and send.**

## Step 4: Open Browser DevTools

1. Go to `http://localhost:5000/register.html`
2. Press **F12** to open Developer Tools
3. Click on **Console** tab
4. Keep this open

## Step 5: Fill and Submit Registration Form

In the registration form enter:
- Name: **testuser**
- Email: **test@test.com**
- Password: **password123**
- Confirm: **password123**

Click **REGISTER**

## Step 6: Check Browser Console

You should see output like:
```
Registration attempt: {name: "testuser", email: "test@test.com", password: "password123", confirmPassword: "password123"}
Sending registration request: {name: "testuser", email: "test@test.com", password: "password123", confirmPassword: "password123"}
Response status: 201
Response data: {success: true, message: "Registration successful", token: "...", user: {...}}
```

## Step 7: Check Server Console

In the terminal where you ran `npm start`, you should see:
```
[SERVER] POST /api/auth/register
[SERVER] Parsed body: {name: "testuser", email: "test@test.com", password: "password123", confirmPassword: "password123"}
Register endpoint received body: {name: "testuser", email: "test@test.com", password: "password123", confirmPassword: "password123"}
Extracted fields: {name: "testuser", email: "test@test.com", password: "password123", confirmPassword: "password123"}
User registered successfully: {userId: 1, name: "testuser", email: "test@test.com"}
```

## What to Report

If registration still fails, please tell me:

1. **What error message do you see?**
   - "All fields are required"
   - "Passwords do not match"
   - "Password must be at least 6 characters"
   - Something else?

2. **What's in the browser console?**
   - Screenshot the Console tab showing red errors

3. **What's in the server console?**
   - Screenshot the terminal where `npm start` runs

4. **What's in the Network tab?**
   - In DevTools, go to **Network** tab
   - Try registration again
   - Click on the `/api/auth/register` request
   - Go to **Request** tab - show what JSON was sent
   - Go to **Response** tab - show what response came back

## Files Modified (With Logging)

- `server.js` - Added console.log statements
- `api.js` - Added console.log statements  
- `main-api.js` - Added console.log statements

All console.log statements will help us trace exactly where the problem is.

## Quick Test Without Browser

You can also test the API directly using this CMD command:

```cmd
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"test\",\"email\":\"test@test.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}"
```

If successful, you should see:
```json
{"success":true,"message":"Registration successful","token":"...","user":{"id":1,"name":"test","email":"test@test.com"}}
```

If it fails, you'll see the error in JSON format.

---

**Please run these steps and share:**
1. Full server console output
2. Full browser console output (F12 → Console)
3. Network tab request/response (F12 → Network)
4. Or the curl command output

This will help me identify exactly where the problem is!
