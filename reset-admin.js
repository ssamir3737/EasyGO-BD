// Reset database and recreate with new admin credentials
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'easygo.db');

// Delete database file
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('✓ Old database deleted');
  } catch (err) {
    console.error('Error deleting database:', err.message);
  }
}

console.log('Database reset complete. Now start the server with: npm start');
console.log('The admin user will be recreated with new credentials: admin@gmail.com / 12345678');
