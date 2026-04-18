# Registration Error - Complete Troubleshooting Guide

## Issue
Registration page shows "Registration failed: All fields are required" even when fields are filled.

## Root Causes (Fixed)
1. ✅ Frontend not sending `confirmPassword` field - **FIXED**
2. ✅ API response format mismatch - **FIXED**
3. ✅ Missing console logging for debugging - **FIXED**

## What Changed

### main-api.js
- Added console.log to trace data being sent
- Added form field validation with specific error messages
- Added logging of response status and data
- Trim() whitespace from inputs
- Show detailed error messages

### api.js (register function)
- Added console.log of received body
- Added console.log of extracted fields
- Added console.log of validation failures
- Added console.log of successful registration

### server.js
- Added console.log of parsed body
- Added console.log of endpoint routing
- Better error handling for JSON parsing

## How to Diagnose

### Step 1: Start Fresh
```cmd
cd d:\Project\Online-ticket-Booking-Project-main
taskkill /IM node.exe /F
rmdir /s /q data
npm install
npm start
```

Wait for all tables to be created.

### Step 2: Test Registration
Open `http://localhost:5000/register.html`

### Step 3: Check Console Output

**In Browser Console (F12 → Console):**
Look for these messages:
```
Registration attempt: {name: "testuser", email: "test@test.com", ...}
Sending registration request: {name: "testuser", email: "test@test.com", ...}
Response status: 201
Response data: {success: true, message: "Registration successful", ...}
```

**In Server Console (where npm start runs):**
Look for these messages:
```
[SERVER] POST /api/auth/register
[SERVER] Parsed body: {name: "testuser", email: "test@test.com", ...}
Register endpoint received body: {name: "testuser", email: "test@test.com", ...}
Extracted fields: {name: "testuser", email: "test@test.com", ...}
User registered successfully: {userId: 1, name: "testuser", email: "test@test.com"}
```

## Expected Behavior

### Success Flow
1. User fills form and clicks Register
2. Browser sends POST to `/api/auth/register` with all 4 fields
3. Server receives request, parses JSON, validates
4. Password hashed with bcrypt
5. User inserted into database
6. JWT token generated
7. Response sent back with success: true
8. Browser displays "Registration successful!"
9. Redirect to login page

### Error Flow (If All Fields Not Present)
Should NOT happen if form properly filled:
```json
{
  "success": false,
  "message": "All fields are required"
}
```

### Error Flow (If Passwords Don't Match)
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

## Field Names (Must Be Exact)

**Form Input Names** (in register.html):
- `name` - Full Name
- `email` - Email address
- `password` - Password
- `confirmPassword` - Confirm Password

**Request Body Sent** (from registerUser):
```json
{
  "name": "...",
  "email": "...",
  "password": "...",
  "confirmPassword": "..."
}
```

**API Receives** (in api.js register):
```json
{
  "name": "...",
  "email": "...",
  "password": "...",
  "confirmPassword": "..."
}
```

All field names must match exactly!

## Database Check

After successful registration, verify in database:

```cmd
sqlite3 data\easygo.db "SELECT * FROM users;"
```

Should show:
```
1|testuser|test@test.com|$2a$10$... (hashed password)
```

## Browser Network Tab Check

F12 → Network Tab:

1. Try registration again
2. Look for `auth/register` request
3. Click on it
4. **Request Headers** tab should show:
   ```
   POST /api/auth/register HTTP/1.1
   Content-Type: application/json
   ```
5. **Request Body** tab should show:
   ```json
   {
     "name": "testuser",
     "email": "test@test.com",
     "password": "password123",
     "confirmPassword": "password123"
   }
   ```
6. **Response** tab should show:
   ```json
   {
     "success": true,
     "message": "Registration successful",
     "token": "...",
     "user": {
       "id": 1,
       "name": "testuser",
       "email": "test@test.com"
     }
   }
   ```

## Common Issues & Solutions

### Issue: "All fields are required"
**Causes:**
1. Form not submitting properly
2. Field names don't match (check spelling!)
3. Empty strings being sent (check form HTML)
4. JSON parsing failure on server

**Solutions:**
- Check form field `name` attributes in register.html
- Check browser console for "Extracted fields" showing empty values
- Check server console for parse errors
- Try with: name="testname", email="test@test.com", password="test123", confirmPassword="test123"

### Issue: "Passwords do not match"
**Solutions:**
- Make sure both password fields have EXACTLY the same value
- Check for extra spaces (trim is now applied)
- No special characters causing issues

### Issue: "Password must be at least 6 characters"
**Solutions:**
- Use password with 6+ characters
- Current checks: name, email, password, confirmPassword all required
- Password must be 6+ chars

### Issue: "Email already registered"
**Solutions:**
- Use a different email address
- Or delete the database: `rmdir /s /q data`
- Then restart server: `npm start`

### Issue: Server console shows parse error
**Solution:**
- Check if Content-Type header is `application/json`
- The server logging will show what was received
- If body is empty: "body was: " - request body not being sent

## Testing Without Browser

Use curl to test API directly:

```cmd
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"testuser\",\"email\":\"test@test.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}"
```

If this works but browser doesn't → Problem is in main-api.js
If this fails → Problem is in server/api.js

## Files to Check

1. **register.html** - Form field names
   - Look for: `<input name="..."`
   - Must be: name, email, password, confirmPassword

2. **main-api.js** - registerUser function
   - Check form.querySelector selectors
   - Check JSON.stringify of request body
   - Check response data parsing

3. **api.js** - register function
   - Check validation logic
   - Check database insert
   - Check response format

4. **server.js** - Request routing
   - Check parseBody function
   - Check endpoint matching
   - Check error handling

## Debug Mode

Add this to the top of registerUser function for extra details:

```javascript
const inputs = form.querySelectorAll('input');
console.log('All form inputs:');
inputs.forEach(input => {
  console.log(`  ${input.name}: "${input.value}"`);
});
```

This will show exactly what values are in each field.

## Next Steps

1. **Apply console logging** → npm start → try registration
2. **Check browser console** → Look for console output
3. **Check server console** → Look for [SERVER] messages
4. **Check Network tab** → See actual request/response
5. **Try curl test** → Confirm API works
6. **Report findings** → Tell me what you see in console

The extensive logging should help identify exactly where it's failing!
