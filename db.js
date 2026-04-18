const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'easygo.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    createTables();
  }
});

function createTables() {
  // Create all tables in sequence with callbacks
  
  // 1. Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      gender TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err);
    else console.log('✓ Users table created/exists');
    
    // Create admin user if doesn't exist
    createDefaultAdmin();
    
    // 2. Routes table (after users)
    createRoutesTable();
  });
}

function createRoutesTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_city TEXT NOT NULL,
      to_city TEXT NOT NULL,
      departure_date TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      price REAL NOT NULL,
      total_seats INTEGER DEFAULT 36,
      available_seats INTEGER DEFAULT 36,
      bus_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating routes table:', err);
    else console.log('✓ Routes table created/exists');
    
    // 3. Seats table (after routes)
    createSeatsTable();
  });
}

function createSeatsTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS seats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_id INTEGER NOT NULL,
      seat_label TEXT NOT NULL,
      status TEXT DEFAULT 'available',
      booked_by INTEGER,
      passenger_gender TEXT,
      FOREIGN KEY (route_id) REFERENCES routes(id),
      FOREIGN KEY (booked_by) REFERENCES users(id),
      UNIQUE(route_id, seat_label)
    )
  `, (err) => {
    if (err) console.error('Error creating seats table:', err);
    else console.log('✓ Seats table created/exists');
    
    // 4. Bookings table (after seats)
    createBookingsTable();
  });
}

function createBookingsTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      route_id INTEGER NOT NULL,
      seats TEXT NOT NULL,
      total_price REAL NOT NULL,
      booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'confirmed',
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (route_id) REFERENCES routes(id)
    )
  `, (err) => {
    if (err) console.error('Error creating bookings table:', err);
    else console.log('✓ Bookings table created/exists');
    
    // 5. Contact messages table (after bookings)
    createContactTable();
  });
}

function createContactTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating contact_messages table:', err);
    else console.log('✓ Contact messages table created/exists');
    
    // 6. Admin requests table (after contact messages)
    createAdminRequestsTable();
  });
}

function createAdminRequestsTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      request TEXT NOT NULL,
      route_id INTEGER,
      status TEXT DEFAULT 'pending',
      response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (route_id) REFERENCES routes(id)
    )
  `, (err) => {
    if (err) console.error('Error creating admin_requests table:', err);
    else console.log('✓ Admin requests table created/exists');
    
    // 7. Finally, populate routes if empty
    populateRoutesIfEmpty();
  });
}

function populateRoutesIfEmpty() {
  db.get('SELECT COUNT(*) as count FROM routes', (err, row) => {
    if (err) {
      console.error('Error checking routes table:', err);
      return;
    }
    
    if (!row || row.count === 0) {
      console.log('✓ Routes table is empty, populating with sample data...');
      insertSampleRoutes(db);
    } else {
      console.log(`✓ Routes table has ${row.count} routes`);
    }
  });
}

function insertSampleRoutes(db) {
  // Generate dates for today, tomorrow, and day after tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  
  const dates = [
    today.toISOString().split('T')[0], // YYYY-MM-DD format
    tomorrow.toISOString().split('T')[0],
    dayAfterTomorrow.toISOString().split('T')[0]
  ];
  
  const baseRoutes = [
    // Dhaka to Chittagong - 6 buses
    { from: 'Dhaka', to: 'Chittagong', time: '06:00 AM', price: 500, bus: 'EasyGo Express' },
    { from: 'Dhaka', to: 'Chittagong', time: '08:30 AM', price: 500, bus: 'EasyGo Comfort' },
    { from: 'Dhaka', to: 'Chittagong', time: '11:00 AM', price: 550, bus: 'EasyGo Premium' },
    { from: 'Dhaka', to: 'Chittagong', time: '02:00 PM', price: 500, bus: 'EasyGo Standard' },
    { from: 'Dhaka', to: 'Chittagong', time: '04:30 PM', price: 550, bus: 'EasyGo Deluxe' },
    { from: 'Dhaka', to: 'Chittagong', time: '07:00 PM', price: 600, bus: 'EasyGo Night Express' },
    
    // Dhaka to Barishal - 5 buses
    { from: 'Dhaka', to: 'Barishal', time: '07:00 AM', price: 450, bus: 'EasyGo Express' },
    { from: 'Dhaka', to: 'Barishal', time: '10:00 AM', price: 450, bus: 'EasyGo Comfort' },
    { from: 'Dhaka', to: 'Barishal', time: '01:00 PM', price: 500, bus: 'EasyGo Premium' },
    { from: 'Dhaka', to: 'Barishal', time: '03:30 PM', price: 450, bus: 'EasyGo Standard' },
    { from: 'Dhaka', to: 'Barishal', time: '06:00 PM', price: 500, bus: 'EasyGo Deluxe' },
    
    // Dhaka to Sylhet - 5 buses
    { from: 'Dhaka', to: 'Sylhet', time: '08:00 AM', price: 600, bus: 'EasyGo Express' },
    { from: 'Dhaka', to: 'Sylhet', time: '10:30 AM', price: 600, bus: 'EasyGo Comfort' },
    { from: 'Dhaka', to: 'Sylhet', time: '01:00 PM', price: 650, bus: 'EasyGo Premium' },
    { from: 'Dhaka', to: 'Sylhet', time: '04:00 PM', price: 600, bus: 'EasyGo Standard' },
    { from: 'Dhaka', to: 'Sylhet', time: '07:00 PM', price: 650, bus: 'EasyGo Deluxe' },
    
    // Chittagong to Cox's Bazar - 5 buses
    { from: 'Chittagong', to: 'Cox\'s Bazar', time: '06:00 AM', price: 350, bus: 'EasyGo Express' },
    { from: 'Chittagong', to: 'Cox\'s Bazar', time: '09:00 AM', price: 350, bus: 'EasyGo Comfort' },
    { from: 'Chittagong', to: 'Cox\'s Bazar', time: '12:00 PM', price: 400, bus: 'EasyGo Premium' },
    { from: 'Chittagong', to: 'Cox\'s Bazar', time: '02:00 PM', price: 350, bus: 'EasyGo Standard' },
    { from: 'Chittagong', to: 'Cox\'s Bazar', time: '05:00 PM', price: 400, bus: 'EasyGo Deluxe' },
    
    // Dhaka to Rajshahi - 5 buses
    { from: 'Dhaka', to: 'Rajshahi', time: '07:00 AM', price: 550, bus: 'EasyGo Express' },
    { from: 'Dhaka', to: 'Rajshahi', time: '09:30 AM', price: 550, bus: 'EasyGo Comfort' },
    { from: 'Dhaka', to: 'Rajshahi', time: '12:00 PM', price: 600, bus: 'EasyGo Premium' },
    { from: 'Dhaka', to: 'Rajshahi', time: '02:30 PM', price: 550, bus: 'EasyGo Standard' },
    { from: 'Dhaka', to: 'Rajshahi', time: '05:00 PM', price: 600, bus: 'EasyGo Deluxe' },
    
    // Dhaka to Rangpur - 5 buses
    { from: 'Dhaka', to: 'Rangpur', time: '06:30 AM', price: 450, bus: 'EasyGo Express' },
    { from: 'Dhaka', to: 'Rangpur', time: '09:00 AM', price: 450, bus: 'EasyGo Comfort' },
    { from: 'Dhaka', to: 'Rangpur', time: '11:30 AM', price: 500, bus: 'EasyGo Premium' },
    { from: 'Dhaka', to: 'Rangpur', time: '02:00 PM', price: 450, bus: 'EasyGo Standard' },
    { from: 'Dhaka', to: 'Rangpur', time: '04:30 PM', price: 500, bus: 'EasyGo Deluxe' },
    
    // Dhaka to Bogura - 5 buses
    { from: 'Dhaka', to: 'Bogura', time: '07:00 AM', price: 400, bus: 'EasyGo Express' },
    { from: 'Dhaka', to: 'Bogura', time: '10:00 AM', price: 400, bus: 'EasyGo Comfort' },
    { from: 'Dhaka', to: 'Bogura', time: '01:00 PM', price: 450, bus: 'EasyGo Premium' },
    { from: 'Dhaka', to: 'Bogura', time: '03:30 PM', price: 400, bus: 'EasyGo Standard' },
    { from: 'Dhaka', to: 'Bogura', time: '06:00 PM', price: 450, bus: 'EasyGo Deluxe' },
    
    // Dhaka to Kuakata - 5 buses
    { from: 'Dhaka', to: 'Kuakata', time: '06:00 AM', price: 600, bus: 'EasyGo Express' },
    { from: 'Dhaka', to: 'Kuakata', time: '08:30 AM', price: 600, bus: 'EasyGo Comfort' },
    { from: 'Dhaka', to: 'Kuakata', time: '11:00 AM', price: 650, bus: 'EasyGo Premium' },
    { from: 'Dhaka', to: 'Kuakata', time: '02:00 PM', price: 600, bus: 'EasyGo Standard' },
    { from: 'Dhaka', to: 'Kuakata', time: '04:30 PM', price: 650, bus: 'EasyGo Deluxe' },
    
    // Dhaka to Dinajpur - 5 buses
    { from: 'Dhaka', to: 'Dinajpur', time: '06:30 AM', price: 500, bus: 'EasyGo Express' },
    { from: 'Dhaka', to: 'Dinajpur', time: '09:00 AM', price: 500, bus: 'EasyGo Comfort' },
    { from: 'Dhaka', to: 'Dinajpur', time: '12:00 PM', price: 550, bus: 'EasyGo Premium' },
    { from: 'Dhaka', to: 'Dinajpur', time: '02:30 PM', price: 500, bus: 'EasyGo Standard' },
    { from: 'Dhaka', to: 'Dinajpur', time: '05:00 PM', price: 550, bus: 'EasyGo Deluxe' },
    
    // Dhaka to Cumilla - 5 buses
    { from: 'Dhaka', to: 'Cumilla', time: '07:00 AM', price: 400, bus: 'EasyGo Express' },
    { from: 'Dhaka', to: 'Cumilla', time: '09:30 AM', price: 400, bus: 'EasyGo Comfort' },
    { from: 'Dhaka', to: 'Cumilla', time: '12:00 PM', price: 450, bus: 'EasyGo Premium' },
    { from: 'Dhaka', to: 'Cumilla', time: '02:30 PM', price: 400, bus: 'EasyGo Standard' },
    { from: 'Dhaka', to: 'Cumilla', time: '05:00 PM', price: 450, bus: 'EasyGo Deluxe' },
  ];

  // Create routes for each date
  const routes = [];
  dates.forEach(date => {
    baseRoutes.forEach(route => {
      routes.push({
        ...route,
        date: date
      });
    });
  });

  const stmt = db.prepare(`
    INSERT INTO routes (from_city, to_city, departure_date, departure_time, price, bus_name, total_seats, available_seats)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  routes.forEach((route) => {
    stmt.run(route.from, route.to, route.date, route.time, route.price, route.bus, 36, 36, (err) => {
      if (err) console.error('Error inserting route:', err);
    });
  });

  stmt.finalize(() => {
    console.log('Sample routes inserted (150 total routes - 50 routes × 3 dates)');
    // Now create seats for all routes
    createSeatsForRoutes(db);
  });
}

function createSeatsForRoutes(db) {
  db.all('SELECT id FROM routes', (err, routes) => {
    if (err) {
      console.error('Error fetching routes:', err);
      return;
    }

  routes.forEach((route) => {
      // Create 36 seats for each route (A1-I4, 9 rows × 4 columns)
      const seatLabels = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 1; col <= 4; col++) {
          seatLabels.push(String.fromCharCode(65 + row) + col);
        }
      }

      const stmt = db.prepare(`
        INSERT OR IGNORE INTO seats (route_id, seat_label, status)
        VALUES (?, ?, ?)
      `);

      seatLabels.forEach((label, index) => {
        // Randomly set some seats as booked for demo
        const status = Math.random() < 0.2 ? 'booked' : 'available';
        stmt.run(route.id, label, status);
      });

      stmt.finalize();
    });

    console.log('Seats created for all routes');
  });
}

// Create default admin user
function createDefaultAdmin() {
  const bcrypt = require('bcryptjs');
  
  db.get("SELECT * FROM users WHERE email = ?", ['admin@gmail.com'], (err, user) => {
    if (!user) {
      const hashedPassword = bcrypt.hashSync('12345678', 10);
      db.run(
        "INSERT INTO users (name, email, password, gender, role) VALUES (?, ?, ?, ?, ?)",
        ['EasyGo Admin', 'admin@gmail.com', hashedPassword, 'Other', 'admin'],
        (err) => {
          if (err) {
            console.error('Error creating admin user:', err);
          } else {
            console.log('✓ Default admin user created (admin@gmail.com / 12345678)');
          }
        }
      );
    } else {
      console.log('✓ Admin user already exists');
    }
  });
}

module.exports = db;
