import sqlite3

# SQLite ডাটাবেসে কানেক্ট করা (যদি word.db না থাকে, এটি নতুন ডাটাবেস তৈরি করবে)
conn = sqlite3.connect('word.db')  # word.db ফাইলের নাম

# কিউরিতে কানেক্ট করা
cursor = conn.cursor()

# Users টেবিল তৈরি করা
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
''')

# Routes টেবিল তৈরি করা
cursor.execute('''
CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    time TEXT NOT NULL,
    price REAL NOT NULL
)
''')

# Seats টেবিল তৈরি করা
cursor.execute('''
CREATE TABLE IF NOT EXISTS seats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route_id INTEGER NOT NULL,
    seat_label TEXT NOT NULL,
    status TEXT DEFAULT 'available',  -- booked / available
    FOREIGN KEY (route_id) REFERENCES routes(id)
)
''')

# Bookings টেবিল তৈরি করা
cursor.execute('''
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    route_id INTEGER NOT NULL,
    seats TEXT NOT NULL,  -- JSON format to store selected seats (e.g. ["A1", "B2"])
    total_price REAL NOT NULL,
    booking_date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
)
''')

# Contact Messages টেবিল তৈরি করা
cursor.execute('''
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
''')

# পরিবর্তন সংরক্ষণ করা
conn.commit()

# কানেকশন বন্ধ করা
conn.close()

print("Database and tables created successfully!")