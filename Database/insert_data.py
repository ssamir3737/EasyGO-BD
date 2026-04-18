import sqlite3
import os

# 'word.db' ফাইলের সঠিক পাথ তৈরি করা
db_path = os.path.join(os.getcwd(), 'Database', 'word.db')  # word.db ফাইলের পূর্ণ পাথ

# SQLite ডাটাবেসে কানেক্ট করা
conn = sqlite3.connect(db_path)  
cursor = conn.cursor()  

cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
               ('John Doe', 'johndoe@example.com', 'password123'))

# Routes টেবিল এ ডাটা ইনসার্ট করা
cursor.execute("INSERT INTO routes (from_city, to_city, time, price) VALUES (?, ?, ?, ?)", 
               ('Dhaka', 'Chittagong', '10:00 AM', 500))

# Seats টেবিল এ ডাটা ইনসার্ট করা
cursor.execute("INSERT INTO seats (route_id, seat_label, status) VALUES (?, ?, ?)", 
               (1, 'A1', 'available'))

# Bookings টেবিল এ ডাটা ইনসার্ট করা
cursor.execute("INSERT INTO bookings (user_id, route_id, seats, total_price, booking_date) VALUES (?, ?, ?, ?, datetime('now'))", 
               (1, 1, '["A1"]', 500))

# Contact Messages টেবিল এ ডাটা ইনসার্ট করা
cursor.execute("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)", 
               ('John Doe', 'johndoe@example.com', 'I want to book a ticket.'))

# পরিবর্তন সংরক্ষণ করা
conn.commit()

# কানেকশন বন্ধ করা
conn.close()

print("Data inserted successfully!")