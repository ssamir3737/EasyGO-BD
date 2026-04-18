// Debug script to verify admin user and test login
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcryptjs = require('bcryptjs');

const dbPath = path.join(__dirname, 'data', 'easygo.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Checking admin user in database...\n');

// Check if admin user exists
db.get('SELECT * FROM users WHERE email = ?', ['admin@gmail.com'], (err, user) => {
  if (err) {
    console.error('❌ Database error:', err);
    db.close();
    return;
  }

  if (!user) {
    console.log('❌ Admin user NOT found in database!');
    console.log('   Creating admin user now...\n');
    
    const hashedPassword = bcryptjs.hashSync('12345678', 10);
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['EasyGo Admin', 'admin@gmail.com', hashedPassword, 'admin'],
      (err) => {
        if (err) {
          console.error('❌ Error creating admin user:', err);
        } else {
          console.log('✅ Admin user created successfully!');
          console.log('   Email: admin@gmail.com');
          console.log('   Password: 12345678');
        }
        db.close();
      }
    );
  } else {
    console.log('✅ Admin user found!');
    console.log('   ID:', user.id);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Hashed Password:', user.password.substring(0, 20) + '...');
    
    // Test password verification
    console.log('\n🔐 Testing password verification...');
    bcryptjs.compare('12345678', user.password, (err, isMatch) => {
      if (err) {
        console.error('❌ Error comparing passwords:', err);
      } else if (isMatch) {
        console.log('✅ Password verification: PASSED');
        console.log('   The password "12345678" matches the hash');
      } else {
        console.log('❌ Password verification: FAILED');
        console.log('   The password "12345678" does NOT match the stored hash');
      }
      db.close();
    });
  }
});
