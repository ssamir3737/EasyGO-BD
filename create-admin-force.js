// Force create admin user in database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcryptjs = require('bcryptjs');

const dbPath = path.join(__dirname, 'data', 'easygo.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Cannot connect to database:', err);
    return;
  }

  console.log('✅ Connected to database');

  // Hash the password
  const hashedPassword = bcryptjs.hashSync('12345678', 10);
  
  // First, try to delete existing admin user
  db.run("DELETE FROM users WHERE email = ?", ['admin@gmail.com'], (err) => {
    if (err) {
      console.error('❌ Error deleting old admin:', err);
    } else {
      console.log('✓ Cleared old admin user if exists');
    }

    // Now insert new admin user
    db.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ['EasyGo Admin', 'admin@gmail.com', hashedPassword, 'admin'],
      (err) => {
        if (err) {
          console.error('❌ Error creating admin user:', err);
        } else {
          console.log('\n✅ Admin user created successfully!\n');
          console.log('Email: admin@gmail.com');
          console.log('Password: 12345678');
          console.log('Role: admin');
        }

        // Verify the user was created
        db.get('SELECT * FROM users WHERE email = ?', ['admin@gmail.com'], (err, user) => {
          if (err) {
            console.error('❌ Error verifying:', err);
          } else if (user) {
            console.log('\n✓ Admin user verified in database:');
            console.log('  - ID:', user.id);
            console.log('  - Name:', user.name);
            console.log('  - Email:', user.email);
            console.log('  - Role:', user.role);
            console.log('  - Password hash:', user.password.substring(0, 20) + '...');

            // Test password
            console.log('\nTesting password...');
            bcryptjs.compare('12345678', user.password, (err, isMatch) => {
              if (isMatch) {
                console.log('✅ Password verification: PASSED');
              } else {
                console.log('❌ Password verification: FAILED');
              }
              db.close();
            });
          } else {
            console.log('❌ User not found after creation');
            db.close();
          }
        });
      }
    );
  });
});
