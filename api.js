const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function sanitizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// Register user
async function register(body, res) {
  const name = sanitizeString(body.name);
  const email = sanitizeString(body.email).toLowerCase();
  const password = sanitizeString(body.password);
  const confirmPassword = sanitizeString(body.confirmPassword);
  const gender = sanitizeString(body.gender);

  if (!name || !email || !password || !confirmPassword || !gender) {
    return sendJSON(res, 400, {
      success: false,
      message: 'All fields are required',
    });
  }

  if (!isValidEmail(email)) {
    return sendJSON(res, 400, {
      success: false,
      message: 'Invalid email format',
    });
  }

  if (password !== confirmPassword) {
    return sendJSON(res, 400, {
      success: false,
      message: 'Passwords do not match',
    });
  }

  if (password.length < 6) {
    return sendJSON(res, 400, {
      success: false,
      message: 'Password must be at least 6 characters',
    });
  }

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return sendJSON(res, 500, { success: false, message: 'Database error' });
    }

    if (user) {
      return sendJSON(res, 400, {
        success: false,
        message: 'Email already registered',
      });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return sendJSON(res, 500, { success: false, message: 'Error hashing password' });
      }

      db.run(
        'INSERT INTO users (name, email, password, gender) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, gender],
        function (err) {
          if (err) {
            console.error('Database insert error:', err);
            return sendJSON(res, 500, {
              success: false,
              message: 'Error creating user',
            });
          }

          const userId = this.lastID;
          const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '24h' });

          console.log('User registered successfully:', { userId, name, email, gender });
          sendJSON(res, 201, {
            success: true,
            message: 'Registration successful',
            token,
            user: { id: userId, name, email, gender },
          });
        }
      );
    });
  });
}

// Login user
async function login(body, res) {
  const email = sanitizeString(body.email).toLowerCase();
  const password = sanitizeString(body.password);

  if (!email || !password) {
    return sendJSON(res, 400, {
      success: false,
      message: 'Email and password are required',
    });
  }

  if (!isValidEmail(email)) {
    return sendJSON(res, 400, {
      success: false,
      message: 'Invalid email format',
    });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return sendJSON(res, 500, { success: false, message: 'Database error' });
    }

    if (!user) {
      return sendJSON(res, 401, {
        success: false,
        message: 'Invalid email or password',
      });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return sendJSON(res, 500, { success: false, message: 'Error comparing passwords' });
      }

      if (!isMatch) {
        return sendJSON(res, 401, {
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '24h',
      });

      sendJSON(res, 200, {
        success: true,
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, gender: user.gender },
      });
    });
  });
}

// Verify token
async function verify(body, res) {
  const { token } = body;

  if (!token) {
    return sendJSON(res, 400, { success: false, message: 'Token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return sendJSON(res, 401, { success: false, message: 'Invalid or expired token' });
    }

    db.get('SELECT id, name, email FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err || !user) {
        return sendJSON(res, 401, { success: false, message: 'User not found' });
      }

      sendJSON(res, 200, {
        success: true,
        user,
      });
    });
  });
}

// Search routes
async function searchRoutes(query, res) {
  const { from, to } = query;

  if (!from || !to) {
    return sendJSON(res, 400, {
      success: false,
      message: 'From and To cities are required',
    });
  }

  // Get current date and next two dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  
  const validDates = [
    today.toISOString().split('T')[0],
    tomorrow.toISOString().split('T')[0],
    dayAfterTomorrow.toISOString().split('T')[0]
  ];

  db.all(
    'SELECT id, from_city, to_city, departure_date, departure_time, price, bus_name, total_seats, available_seats FROM routes WHERE from_city = ? AND to_city = ? AND departure_date IN (?, ?, ?)',
    [from, to, ...validDates],
    (err, routes) => {
      if (err) {
        return sendJSON(res, 500, { success: false, message: 'Database error' });
      }

      sendJSON(res, 200, {
        success: true,
        routes: routes || [],
      });
    }
  );
}

// Get all routes
async function getAllRoutes(res) {
  db.all('SELECT id, from_city, to_city, departure_date, departure_time, price, bus_name, total_seats, available_seats FROM routes', (err, routes) => {
    if (err) {
      return sendJSON(res, 500, { success: false, message: 'Database error' });
    }

    sendJSON(res, 200, {
      success: true,
      routes: routes || [],
    });
  });
}

// Get seats for route
async function getSeats(routeId, res) {
  db.all(
    `SELECT s.*, u.gender as user_gender FROM seats s 
     LEFT JOIN users u ON s.booked_by = u.id 
     WHERE s.route_id = ? ORDER BY s.seat_label`,
    [routeId],
    (err, seats) => {
      if (err) {
        return sendJSON(res, 500, { success: false, message: 'Database error' });
      }

      sendJSON(res, 200, {
        success: true,
        seats: seats || [],
      });
    }
  );
}

// Create booking
async function createBooking(body, token, res) {
  const routeId = parseInt(body.routeId, 10);
  const seats = Array.isArray(body.seats) ? body.seats : [];
  const totalPrice = Number(body.totalPrice);

  if (!token) {
    return sendJSON(res, 401, { success: false, message: 'No token provided' });
  }

  if (!routeId || seats.length === 0 || !totalPrice) {
    return sendJSON(res, 400, {
      success: false,
      message: 'Missing or invalid booking fields',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return sendJSON(res, 401, { success: false, message: 'Invalid token' });
    }

    const userId = decoded.id;
    const bookingId = 'EGB' + Date.now();

    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        return sendJSON(res, 500, { success: false, message: 'Transaction error' });
      }

      db.run(
        'INSERT INTO bookings (booking_id, user_id, route_id, seats, total_price) VALUES (?, ?, ?, ?, ?)',
        [bookingId, userId, routeId, JSON.stringify(seats), totalPrice],
        function (err) {
          if (err) {
            return db.run('ROLLBACK', () => {
              sendJSON(res, 500, { success: false, message: 'Error creating booking' });
            });
          }

          let completed = 0;
          let hasError = false;

          seats.forEach((seatLabel) => {
            db.run(
              'UPDATE seats SET status = ?, booked_by = ? WHERE route_id = ? AND seat_label = ?',
              ['booked', userId, routeId, seatLabel],
              (err) => {
                if (err) {
                  console.error('Error updating seat:', seatLabel, err);
                  hasError = true;
                }
                completed++;

                if (completed === seats.length) {
                  if (hasError) {
                    return db.run('ROLLBACK', () => {
                      sendJSON(res, 500, { success: false, message: 'Error updating seats - database issue' });
                    });
                  }

                  db.run('COMMIT', (err) => {
                    if (err) {
                      return sendJSON(res, 500, { success: false, message: 'Commit error' });
                    }

                    sendJSON(res, 201, {
                      success: true,
                      message: 'Booking created successfully',
                      bookingId,
                      booking: { booking_id: bookingId, user_id: userId, route_id: routeId, seats, total_price: totalPrice },
                    });
                  });
                }
              }
            );
          });
        }
      );
    });
  });
}

// Get booking history
async function getBookingHistory(userId, token, res) {
  if (!token) {
    return sendJSON(res, 401, { success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return sendJSON(res, 401, { success: false, message: 'Invalid token' });
    }

    const requestedUserId = parseInt(userId, 10);
    if (decoded.id !== requestedUserId) {
      return sendJSON(res, 403, { success: false, message: 'Unauthorized access to booking history' });
    }

    db.all(
      `SELECT b.*, r.from_city, r.to_city, r.departure_time, r.price 
       FROM bookings b 
       JOIN routes r ON b.route_id = r.id 
       WHERE b.user_id = ? 
       ORDER BY b.booking_date DESC`,
      [requestedUserId],
      (err, bookings) => {
        if (err) {
          return sendJSON(res, 500, { success: false, message: 'Database error' });
        }

        const formattedBookings = bookings.map((booking) => ({
          ...booking,
          seats: JSON.parse(booking.seats),
        }));

        sendJSON(res, 200, {
          success: true,
          bookings: formattedBookings || [],
        });
      }
    );
  });
}

// Get booking details
async function getBooking(bookingId, token, res) {
  if (!token) {
    return sendJSON(res, 401, { success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return sendJSON(res, 401, { success: false, message: 'Invalid token' });
    }

    db.get(
      `SELECT b.*, r.from_city, r.to_city, r.departure_time, r.price, u.name, u.email
       FROM bookings b 
       JOIN routes r ON b.route_id = r.id 
       JOIN users u ON b.user_id = u.id 
       WHERE b.booking_id = ?`,
      [bookingId],
      (err, booking) => {
        if (err) {
          return sendJSON(res, 500, { success: false, message: 'Database error' });
        }

        if (!booking) {
          return sendJSON(res, 404, { success: false, message: 'Booking not found' });
        }

        if (booking.user_id !== decoded.id) {
          return sendJSON(res, 403, { success: false, message: 'Unauthorized access to booking details' });
        }

        booking.seats = JSON.parse(booking.seats);

        sendJSON(res, 200, {
          success: true,
          booking,
        });
      }
    );
  });
}

// Submit contact message
async function submitContact(body, res) {
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return sendJSON(res, 400, {
      success: false,
      message: 'All fields are required',
    });
  }

  db.run(
    'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    function (err) {
      if (err) {
        return sendJSON(res, 500, { success: false, message: 'Error submitting message' });
      }

      sendJSON(res, 201, {
        success: true,
        message: 'Message submitted successfully',
      });
    }
  );
}

// Submit admin request from user
async function submitAdminRequest(body, token, res) {
  const requestText = sanitizeString(body.request);
  const routeId = body.routeId ? parseInt(body.routeId, 10) : null;

  if (!token) {
    return sendJSON(res, 401, { success: false, message: 'No token provided' });
  }

  if (!requestText) {
    return sendJSON(res, 400, {
      success: false,
      message: 'Request text is required',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return sendJSON(res, 401, { success: false, message: 'Invalid token' });
    }

    const userId = decoded.id;

    db.get('SELECT name, email FROM users WHERE id = ?', [userId], (err, user) => {
      if (err || !user) {
        return sendJSON(res, 401, { success: false, message: 'Invalid user token' });
      }

      db.run(
        `INSERT INTO admin_requests (user_id, user_name, user_email, request, route_id, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, user.name, user.email, requestText, routeId, 'pending'],
        function (err) {
          if (err) {
            console.error('Error saving admin request:', err);
            return sendJSON(res, 500, { success: false, message: 'Error submitting request' });
          }

          sendJSON(res, 201, {
            success: true,
            message: 'Request submitted successfully. Admin will review it shortly.',
            requestId: this.lastID,
          });
        }
      );
    });
  });
}

// Get all admin requests
async function getAllAdminRequests(res) {
  db.all(
    `SELECT * FROM admin_requests ORDER BY created_at DESC`,
    (err, requests) => {
      if (err) {
        console.error('Error fetching admin requests:', err);
        return sendJSON(res, 500, { success: false, message: 'Database error' });
      }

      sendJSON(res, 200, {
        success: true,
        requests: requests || [],
      });
    }
  );
}

// Update admin request status
async function updateAdminRequestStatus(requestId, status, response, res) {
  db.run(
    `UPDATE admin_requests SET status = ?, response = ? WHERE id = ?`,
    [status, response, requestId],
    (err) => {
      if (err) {
        console.error('Error updating request status:', err);
        return sendJSON(res, 500, { success: false, message: 'Database error' });
      }

      sendJSON(res, 200, {
        success: true,
        message: 'Request status updated successfully',
      });
    }
  );
}

module.exports = {
  register,
  login,
  verify,
  searchRoutes,
  getAllRoutes,
  getSeats,
  createBooking,
  getBookingHistory,
  getBooking,
  submitContact,
  submitAdminRequest,
  getAllAdminRequests,
  updateAdminRequestStatus,
};
