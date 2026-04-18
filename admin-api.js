// Admin API Endpoints

const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

if (JWT_SECRET === 'your-secret-key') {
  console.warn('[SECURITY] Warning: admin-api is using default JWT_SECRET. Set JWT_SECRET in your environment for production.');
}

// Admin Login
async function adminLogin(body, res) {
  const { email, password } = body;
  console.log('[ADMIN] Login attempt:', { email });

  if (!email || !password) {
    console.log('[ADMIN] Missing email or password');
    return sendJSON(res, 400, {
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        try {
          if (err) {
            console.error('[ADMIN] Database error:', err.message);
            return sendJSON(res, 500, { success: false, message: 'Database error: ' + err.message });
          }

          if (!user) {
            console.log('[ADMIN] User not found with email:', email);
            return sendJSON(res, 401, {
              success: false,
              message: 'Invalid admin credentials'
            });
          }

          // Check if user is admin
          if (user.role !== 'admin') {
            console.log('[ADMIN] User is not admin:', { email, role: user.role });
            return sendJSON(res, 401, {
              success: false,
              message: 'Invalid admin credentials'
            });
          }

          console.log('[ADMIN] User found:', { id: user.id, email: user.email, role: user.role });

          // Check password
          bcryptjs.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.error('[ADMIN] Password comparison error:', err);
              return sendJSON(res, 401, {
                success: false,
                message: 'Invalid admin credentials'
              });
            }
            
            if (!isMatch) {
              console.log('[ADMIN] Password mismatch for user:', email);
              return sendJSON(res, 401, {
                success: false,
                message: 'Invalid admin credentials'
              });
            }

            console.log('[ADMIN] Password verified! Generating token...');

            // Generate token
            const token = jwt.sign(
              { id: user.id, email: user.email, role: 'admin' },
              JWT_SECRET,
              { expiresIn: '4h' }
            );

            console.log('[ADMIN] Login successful for:', email);

            sendJSON(res, 200, {
              success: true,
              message: 'Admin login successful',
              token,
              admin: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
              }
            });
          });
        } catch (innerErr) {
          console.error('[ADMIN] Unexpected error:', innerErr);
          return sendJSON(res, 500, { success: false, message: 'Server error' });
        }
      }
    );
  } catch (outerErr) {
    console.error('[ADMIN] Outer error:', outerErr);
    return sendJSON(res, 500, { success: false, message: 'Database connection error' });
  }
}

// Verify Admin Token
function verifyAdminToken(req, res) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return sendJSON(res, 401, { success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return sendJSON(res, 403, { success: false, message: 'Invalid admin token' });
    }
    return decoded;
  });
}

// Get Dashboard Stats
async function getDashboardStats(res) {
  db.all('SELECT COUNT(*) as count FROM routes', (err, routes) => {
    db.all('SELECT COUNT(*) as count FROM bookings', (err, bookings) => {
      db.all('SELECT SUM(total_price) as total FROM bookings', (err, revenue) => {
        db.all('SELECT COUNT(*) as count FROM users WHERE role = ?', ['user'], (err, users) => {
          sendJSON(res, 200, {
            success: true,
            stats: {
              totalRoutes: routes[0]?.count || 0,
              totalBookings: bookings[0]?.count || 0,
              totalRevenue: revenue[0]?.total || 0,
              totalUsers: users[0]?.count || 0
            }
          });
        });
      });
    });
  });
}

// Get Recent Bookings
async function getRecentBookings(res) {
  db.all(`
    SELECT b.booking_id, b.total_price, b.seats, b.booking_date, b.status,
           r.from_city, r.to_city, u.email as user_email
    FROM bookings b
    JOIN routes r ON b.route_id = r.id
    JOIN users u ON b.user_id = u.id
    ORDER BY b.booking_date DESC
    LIMIT 10
  `, (err, bookings) => {
    if (err) {
      return sendJSON(res, 500, { success: false, message: 'Database error' });
    }

    sendJSON(res, 200, {
      success: true,
      bookings: bookings || []
    });
  });
}

// Get All Routes
async function getAllRoutes(res) {
  db.all('SELECT * FROM routes', (err, routes) => {
    if (err) {
      return sendJSON(res, 500, { success: false, message: 'Database error' });
    }

    sendJSON(res, 200, {
      success: true,
      routes: routes || []
    });
  });
}

// Add New Route
async function addRoute(body, res) {
  const { from_city, to_city, departure_time, price, bus_name, total_seats } = body;

  if (!from_city || !to_city || !departure_time || !price || !bus_name) {
    return sendJSON(res, 400, {
      success: false,
      message: 'All fields are required'
    });
  }

  db.run(
    'INSERT INTO routes (from_city, to_city, departure_time, price, bus_name, total_seats, available_seats) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [from_city, to_city, departure_time, price, bus_name, total_seats || 36, total_seats || 36],
    function(err) {
      if (err) {
        return sendJSON(res, 500, { success: false, message: 'Error adding route' });
      }

      const routeId = this.lastID;

      // Create seats for new route
      const seatLabels = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 1; col <= 4; col++) {
          seatLabels.push(String.fromCharCode(65 + row) + col);
        }
      }

      const stmt = db.prepare('INSERT OR IGNORE INTO seats (route_id, seat_label, status) VALUES (?, ?, ?)');
      seatLabels.forEach(label => {
        stmt.run(routeId, label, 'available');
      });
      stmt.finalize();

      sendJSON(res, 201, {
        success: true,
        message: 'Route added successfully',
        routeId
      });
    }
  );
}

// Delete Route
async function deleteRoute(routeId, res) {
  // Delete seats first
  db.run('DELETE FROM seats WHERE route_id = ?', [routeId], (err) => {
    // Then delete route
    db.run('DELETE FROM routes WHERE id = ?', [routeId], (err) => {
      if (err) {
        return sendJSON(res, 500, { success: false, message: 'Error deleting route' });
      }

      sendJSON(res, 200, {
        success: true,
        message: 'Route deleted successfully'
      });
    });
  });
}

// Get All Bookings
async function getAllBookings(res) {
  db.all(`
    SELECT b.booking_id, b.total_price, b.seats, b.booking_date, b.status,
           r.from_city, r.to_city, u.email as user_email
    FROM bookings b
    JOIN routes r ON b.route_id = r.id
    JOIN users u ON b.user_id = u.id
    ORDER BY b.booking_date DESC
  `, (err, bookings) => {
    if (err) {
      return sendJSON(res, 500, { success: false, message: 'Database error' });
    }

    sendJSON(res, 200, {
      success: true,
      bookings: bookings || []
    });
  });
}

// Get All Users
async function getAllUsers(res) {
  db.all(`
    SELECT u.id, u.name, u.email, u.created_at, COUNT(b.id) as bookingCount
    FROM users u
    LEFT JOIN bookings b ON u.id = b.user_id
    WHERE u.role = ?
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `, ['user'], (err, users) => {
    if (err) {
      return sendJSON(res, 500, { success: false, message: 'Database error' });
    }

    sendJSON(res, 200, {
      success: true,
      users: users || []
    });
  });
}

// Helper to send JSON
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

module.exports = {
  adminLogin,
  verifyAdminToken,
  getDashboardStats,
  getRecentBookings,
  getAllRoutes,
  addRoute,
  deleteRoute,
  getAllBookings,
  getAllUsers
};
