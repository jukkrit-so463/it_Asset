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

async function seedData() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    await ensureCategoryTable(connection);

    // Create sample locations
    console.log('📍 Creating sample locations...');
    const [locationResult] = await connection.execute(`
      INSERT INTO locations (division, department, status) VALUES 
      ('ฝ่ายผลิต', 'แผนกผลิต 1', 'active'),
      ('ฝ่ายผลิต', 'แผนกผลิต 2', 'active'),
      ('ฝ่ายบัญชี', 'แผนกบัญชี', 'active'),
      ('ฝ่ายบุคคล', 'แผนกบุคคล', 'active'),
      ('ฝ่ายไอที', 'แผนกไอที', 'active')
    `);

    // Create sample users
    console.log('👥 Creating sample users...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);
    
    const [userResult] = await connection.execute(`
      INSERT INTO users (username, password, email, first_name, last_name, rank, locations_id, role, status) VALUES 
      ('user1', ?, 'user1@example.com', 'สมชาย', 'ใจดี', 'พนักงาน', 1, 'user', 'active'),
      ('user2', ?, 'user2@example.com', 'สมหญิง', 'รักดี', 'หัวหน้างาน', 2, 'user', 'active'),
      ('user3', ?, 'user3@example.com', 'สมศักดิ์', 'มั่นคง', 'ผู้จัดการ', 3, 'user', 'active'),
      ('itadmin', ?, 'itadmin@example.com', 'ไอที', 'แอดมิน', 'ผู้ดูแลระบบ', 5, 'admin', 'active')
    `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword]);

    // Create sample devices
    console.log('💻 Creating sample devices...');
    const [deviceResult] = await connection.execute(`
      INSERT INTO devices (user_id, locations_id, device_type, service_tag, date_received, operational_status) VALUES 
      (1, 1, 'Computer', 'LEN-001', '2024-01-15', 'active'),
      (2, 2, 'Computer', 'HP-002', '2024-02-20', 'active'),
      (3, 3, 'Computer', 'DELL-003', '2024-03-10', 'active'),
      (4, 5, 'Computer', 'LEN-004', '2024-01-05', 'active'),
      (1, 1, 'Printer', 'HP-PRINT-001', '2024-02-01', 'active'),
      (2, 2, 'Printer', 'CANON-PRINT-002', '2024-03-15', 'in_repair'),
      (3, 3, 'Scanner', 'EPSON-SCAN-001', '2024-01-20', 'active'),
      (4, 5, 'Server', 'DELL-SRV-001', '2024-01-01', 'active'),
      (1, 1, 'Network Switch', 'CISCO-SW-001', '2024-02-10', 'active'),
      (2, 2, 'Computer', 'LEN-005', '2024-03-25', 'decommissioned')
    `);

    // Create sample IP addresses
    console.log('🌐 Creating sample IP addresses...');
    const [ipResult] = await connection.execute(`
      INSERT INTO ip_addresses (device_id, ip_address, network_level, status) VALUES 
      (1, '192.168.1.100', '55', 'in_use'),
      (2, '192.168.1.101', '55', 'in_use'),
      (3, '192.168.1.102', '55', 'in_use'),
      (4, '192.168.1.103', '55', 'in_use'),
      (8, '192.168.1.10', '55', 'in_use'),
      (9, '192.168.1.1', '55', 'in_use')
    `);

    // Optional categories seed (commented out by default)
    // await connection.query('INSERT INTO device_categories (code, name, description) VALUES ? ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)', [
    //   [
    //     ['COM', 'Computer', 'ครุภัณฑ์คอมพิวเตอร์'],
    //     ['PRN', 'Printer', 'เครื่องพิมพ์'],
    //     ['SRV', 'Server', 'เซิร์ฟเวอร์'],
    //     ['SW', 'Network Switch', 'อุปกรณ์เครือข่าย'],
    //   ]
    // ]);

    console.log('✅ Seed completed');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

seedData();
