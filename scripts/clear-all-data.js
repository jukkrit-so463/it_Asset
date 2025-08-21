import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'it_asset_db',
  port: process.env.DB_PORT || 3306
};

async function clearAllData() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    console.log('🗑️ Clearing ALL data...');

    // Clear all data
    await connection.execute('DELETE FROM ip_addresses');
    await connection.execute('DELETE FROM devices');
    await connection.execute('DELETE FROM users');
    await connection.execute('DELETE FROM locations');

    // Reset counters
    await connection.execute('ALTER TABLE ip_addresses AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE devices AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE locations AUTO_INCREMENT = 1');

    console.log('✅ ALL data cleared successfully!');
    console.log('⚠️  Run "npm run create-admin" to create admin user');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

clearAllData();
