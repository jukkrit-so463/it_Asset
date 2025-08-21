# IT Asset Management System

ระบบจัดการทรัพย์สินไอที ที่พัฒนาด้วย React + TypeScript และ Node.js + MySQL

## Features

- 🔐 ระบบ Authentication ด้วย JWT
- 👥 จัดการผู้ใช้งาน (Users)
- 💻 จัดการอุปกรณ์ (Assets/Devices)
- 📍 จัดการสถานที่ (Locations)
- 🌐 IP Address Management
- 📊 Dashboard และ Reports
- 🔒 Role-based Access Control (Admin/User)

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui Components
- React Router DOM
- React Hook Form + Zod

### Backend
- Node.js + Express
- MySQL Database
- JWT Authentication
- bcryptjs (Password Hashing)
- Helmet (Security)
- CORS
- Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd it_Asset
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### 3.1 Create MySQL Database
```sql
CREATE DATABASE it_asset_db;
```

#### 3.2 Import Database Schema
```bash
mysql -u root -p it_asset_db < it_asset_db.sql
```

#### 3.3 Create Admin User
```sql
INSERT INTO users (username, password, email, first_name, last_name, role) 
VALUES ('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8KqG', 'admin@example.com', 'Admin', 'User', 'admin');
```
*Password: admin123*

### 4. Environment Configuration

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:
```env
# Database Configuration
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
```

### 5. Start Development Servers

#### Option 1: Start Both Frontend and Backend
```bash
npm run dev:full
```

#### Option 2: Start Separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

## Usage

### Default Login Credentials
- **Username:** admin
- **Password:** admin123

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### Assets
- `GET /api/assets` - Get all devices
- `POST /api/assets` - Create new device
- `PUT /api/assets/:id` - Update device
- `DELETE /api/assets/:id` - Delete device

#### Users
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create new user (Admin only)

## Security Features

- ✅ JWT Token Authentication
- ✅ Password Hashing (bcrypt)
- ✅ CORS Protection
- ✅ Helmet Security Headers
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ SQL Injection Prevention
- ✅ XSS Protection

## Project Structure

```
it_Asset/
├── server/                 # Backend API
│   ├── config/
│   │   └── database.js     # Database connection
│   ├── middleware/
│   │   └── auth.js         # Authentication middleware
│   ├── routes/
│   │   ├── auth.js         # Auth routes
│   │   ├── assets.js       # Asset routes
│   │   └── users.js        # User routes
│   └── index.js            # Server entry point
├── src/                    # Frontend
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   └── ...
├── it_asset_db.sql         # Database schema
└── package.json
```

## Development

### Adding New Features

1. **Backend API**: Add routes in `server/routes/`
2. **Frontend**: Add components in `src/components/` or pages in `src/pages/`
3. **Database**: Update schema in `it_asset_db.sql`

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production database
- Set proper `CORS_ORIGIN`

### Security Checklist
- [ ] Change default admin password
- [ ] Use HTTPS
- [ ] Set up proper firewall rules
- [ ] Regular database backups
- [ ] Monitor logs
- [ ] Update dependencies regularly

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **CORS Error**
   - Check `CORS_ORIGIN` in `.env`
   - Verify frontend URL matches

3. **JWT Token Error**
   - Check `JWT_SECRET` is set
   - Verify token expiration

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
