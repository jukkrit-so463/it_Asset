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

async function ensureCategoryTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS device_categories (
      category_id INT NOT NULL AUTO_INCREMENT,
      code VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (category_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function clearData() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    await ensureCategoryTable(connection);

    console.log('🗑️ Clearing sample data...');

    // Categories
    console.log('🏷️ Clearing categories...');
    await connection.execute('DELETE FROM device_categories');
    await connection.execute('ALTER TABLE device_categories AUTO_INCREMENT = 1');

    // IPs
    console.log('🌐 Clearing IP addresses...');
    await connection.execute('DELETE FROM ip_addresses');
    await connection.execute('ALTER TABLE ip_addresses AUTO_INCREMENT = 1');

    // Devices
    console.log('💻 Clearing devices...');
    await connection.execute('DELETE FROM devices');
    await connection.execute('ALTER TABLE devices AUTO_INCREMENT = 1');

    // Users (keep admin id 1 if exists)
    console.log('👥 Clearing users (keep admin)...');
    await connection.execute('DELETE FROM users WHERE user_id > 1');
    await connection.execute('ALTER TABLE users AUTO_INCREMENT = 2');

    // Locations
    console.log('📍 Clearing locations...');
    await connection.execute('DELETE FROM locations');
    await connection.execute('ALTER TABLE locations AUTO_INCREMENT = 1');

    console.log('✅ Sample data cleared successfully!');

  } catch (error) {
    console.error('❌ Error clearing sample data:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

clearData();
