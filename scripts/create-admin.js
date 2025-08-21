import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'it_asset_db',
  port: process.env.DB_PORT || 3306
};

async function createAdminUser() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check if admin user already exists
    const [existingUsers] = await connection.execute(
      'SELECT user_id FROM users WHERE username = ?',
      ['admin']
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists');
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create admin user
    const [result] = await connection.execute(`
      INSERT INTO users (username, password, email, first_name, last_name, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['admin', hashedPassword, 'admin@example.com', 'Admin', 'User', 'admin', 'active']);

    console.log('✅ Admin user created successfully');
    console.log('📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdminUser();
