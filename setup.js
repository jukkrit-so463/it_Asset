#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 IT Asset Management System Setup');
console.log('=====================================\n');

// Check if .env file exists
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=it_asset_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
`;

  writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Make sure MySQL server is running');
console.log('2. Create database: CREATE DATABASE it_asset_db;');
console.log('3. Import schema: mysql -u root -p it_asset_db < it_asset_db.sql');
console.log('4. Install dependencies: npm install');
console.log('5. Create admin user: npm run create-admin');
console.log('6. Start development: npm run dev:full');
console.log('\n🔗 Frontend: http://localhost:5173');
console.log('🔗 Backend API: http://localhost:5000/api');
console.log('\n📧 Default login: admin / admin123');
