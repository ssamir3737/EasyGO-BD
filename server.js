const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ALLOWED_ORIGINS = ['http://localhost:5000', 'http://127.0.0.1:5000'];

if (JWT_SECRET === 'your-secret-key') {
  console.warn('[SECURITY] Warning: Using default JWT_SECRET. Set JWT_SECRET in your environment for production.');
}

// Initialize database
const db = require('./db');

// Import API handlers
const apiHandlers = require('./api');
const adminHandlers = require('./admin-api');

const PORT = process.env.PORT || 5000;

// Helper function to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        console.log('[SERVER] Parsed body:', parsed);
        resolve(parsed);
      } catch (error) {
        console.error('[SERVER] JSON parse error:', error, 'body was:', body);
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

// Helper function to verify JWT token
function verifyToken(token, requiredRole = null) {
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (requiredRole && decoded.role !== requiredRole) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to serve static files
function serveStaticFile(pathname, res) {
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Forbidden' }));
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Enable CORS only for allowed origins
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';");
  if (req.connection.encrypted || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  try {
    // API Routes
    if (pathname.startsWith('/api/')) {
      console.log(`[SERVER] ${req.method} ${pathname}`);
      
      // Parse body for POST/PUT requests
      const body = req.method === 'POST' || req.method === 'PUT' ? await parseBody(req) : {};

      // Auth endpoints
      if (pathname === '/api/auth/register' && req.method === 'POST') {
        console.log('[SERVER] Register endpoint called with body:', body);
        return await apiHandlers.register(body, res);
      }
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        return await apiHandlers.login(body, res);
      }
      if (pathname === '/api/auth/verify' && req.method === 'POST') {
        return await apiHandlers.verify(body, res);
      }

      // Routes endpoints
      if (pathname === '/api/routes/search' && req.method === 'GET') {
        return await apiHandlers.searchRoutes(query, res);
      }
      if (pathname === '/api/routes' && req.method === 'GET') {
        return await apiHandlers.getAllRoutes(res);
      }

      // Seats endpoints
      const seatsMatch = pathname.match(/^\/api\/seats\/(\d+)$/);
      if (seatsMatch && req.method === 'GET') {
        return await apiHandlers.getSeats(seatsMatch[1], res);
      }

      // Bookings endpoints
      if (pathname === '/api/bookings/create' && req.method === 'POST') {
        const token = req.headers.authorization?.split(' ')[1];
        return await apiHandlers.createBooking(body, token, res);
      }

      const historyMatch = pathname.match(/^\/api\/bookings\/history\/(\d+)$/);
      if (historyMatch && req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];
        return await apiHandlers.getBookingHistory(historyMatch[1], token, res);
      }

      const bookingMatch = pathname.match(/^\/api\/bookings\/([A-Z0-9]+)$/);
      if (bookingMatch && req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];
        return await apiHandlers.getBooking(bookingMatch[1], token, res);
      }

      // Contact endpoints
      if (pathname === '/api/contact/submit' && req.method === 'POST') {
        return await apiHandlers.submitContact(body, res);
      }

      // Admin request endpoints
      if (pathname === '/api/admin/request' && req.method === 'POST') {
        const token = req.headers.authorization?.split(' ')[1];
        return await apiHandlers.submitAdminRequest(body, token, res);
      }

      if (pathname === '/api/admin/requests' && req.method === 'GET') {
        return await apiHandlers.getAllAdminRequests(res);
      }

      // Update request status
      const updateRequestMatch = pathname.match(/^\/api\/admin\/request\/(\d+)\/status$/);
      if (updateRequestMatch && req.method === 'POST') {
        const { status, response } = body;
        return await apiHandlers.updateAdminRequestStatus(updateRequestMatch[1], status, response, res);
      }

      // Admin endpoints
      if (pathname === '/api/admin/login' && req.method === 'POST') {
        return await adminHandlers.adminLogin(body, res);
      }

      if (pathname === '/api/admin/dashboard' && req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !verifyToken(token, 'admin')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
          return;
        }
        return await adminHandlers.getDashboardStats(res);
      }

      if (pathname === '/api/admin/bookings/recent' && req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !verifyToken(token, 'admin')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
          return;
        }
        return await adminHandlers.getRecentBookings(res);
      }

      if (pathname === '/api/admin/routes' && req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !verifyToken(token, 'admin')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
          return;
        }
        return await adminHandlers.getAllRoutes(res);
      }

      if (pathname === '/api/admin/routes/add' && req.method === 'POST') {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !verifyToken(token, 'admin')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
          return;
        }
        return await adminHandlers.addRoute(body, res);
      }

      const deleteRouteMatch = pathname.match(/^\/api\/admin\/routes\/delete\/(\d+)$/);
      if (deleteRouteMatch && req.method === 'DELETE') {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !verifyToken(token, 'admin')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
          return;
        }
        return await adminHandlers.deleteRoute(deleteRouteMatch[1], res);
      }

      if (pathname === '/api/admin/bookings' && req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !verifyToken(token, 'admin')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
          return;
        }
        return await adminHandlers.getAllBookings(res);
      }

      if (pathname === '/api/admin/users' && req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !verifyToken(token, 'admin')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
          return;
        }
        return await adminHandlers.getAllUsers(res);
      }

      // Health check
      if (pathname === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'Server is running', timestamp: new Date() }));
        return;
      }

      // API not found
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'API endpoint not found' }));
      return;
    }

    // Serve static files
    serveStaticFile(pathname, res);

  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
  }
});

server.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API endpoints available at http://localhost:${PORT}/api`);
  console.log(`✓ Frontend available at http://localhost:${PORT}`);
});
