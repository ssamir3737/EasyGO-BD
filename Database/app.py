from flask import Flask, request, jsonify
import sqlite3
import json

app = Flask(__name__)

# SQLite ডাটাবেসে কানেক্ট করার ফাংশন
def get_db_connection():
    conn = sqlite3.connect('Database/word.db')  # এখানে 'word.db' আপনার ডাটাবেস ফাইলের নাম
    conn.row_factory = sqlite3.Row  # রিটার্ন রোকে ডিকশনারি আকারে পাওয়া যাবে
    return conn

# রেজিস্ট্রেশন API (নতুন ইউজার রেজিস্টার করা)
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']

    # SQLite ডাটাবেসে কানেক্ট
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # ইউজার ইনসার্ট করা
    cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, password))
    conn.commit()
    conn.close()

    return jsonify({"message": "User registered successfully!"}), 201

# বুকিং API (বুকিং করা)
@app.route('/book', methods=['POST'])
def book_ticket():
    data = request.get_json()
    user_id = data['user_id']
    route_id = data['route_id']
    seats = json.dumps(data['seats'])
    total_price = data['total_price']

    # SQLite ডাটাবেসে কানেক্ট
    conn = get_db_connection()
    cursor = conn.cursor()

    # বুকিং ইনসার্ট করা
    cursor.execute("INSERT INTO bookings (user_id, route_id, seats, total_price, booking_date) VALUES (?, ?, ?, ?, datetime('now'))", 
                   (user_id, route_id, seats, total_price))
    conn.commit()
    conn.close()

    return jsonify({"message": "Booking successful!"}), 201

# Flask অ্যাপ রান করা
if __name__ == '__main__':
    app.run(debug=False)  # Debug mode বন্ধ রাখুন