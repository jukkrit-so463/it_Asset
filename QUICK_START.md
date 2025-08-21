# Quick Start Guide

คู่มือการติดตั้งและใช้งานระบบ IT Asset Management แบบรวดเร็ว

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่าฐานข้อมูล
```bash
# สร้างฐานข้อมูล
mysql -u root -p -e "CREATE DATABASE it_asset_db;"

# Import schema
mysql -u root -p it_asset_db < it_asset_db.sql
```

### 3. ตั้งค่า Environment
```bash
# รัน setup script
npm run setup
```

### 4. สร้าง Admin User
```bash
npm run create-admin
```

### 5. เพิ่มข้อมูลตัวอย่าง (Optional)
```bash
npm run seed-data
```

### 6. เคลียร์ข้อมูล (Optional)
```bash
# เคลียร์ข้อมูลตัวอย่าง (เก็บ admin user)
npm run clear-data

# เคลียร์ข้อมูลทั้งหมด (รวม admin user)
npm run clear-all-data
```

### 7. เริ่มต้นใช้งาน
```bash
# เริ่มทั้ง Frontend และ Backend
npm run dev:full
```

## การเข้าถึงระบบ

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Login**: admin / admin123

### ข้อมูลตัวอย่าง (หลังจากรัน seed-data)
- **Admin**: admin / admin123
- **User1**: user1 / password123
- **User2**: user2 / password123
- **User3**: user3 / password123
- **IT Admin**: itadmin / password123

## โครงสร้างฐานข้อมูล

### ตารางหลัก
- `users` - ผู้ใช้งานระบบ
- `devices` - อุปกรณ์/ทรัพย์สิน
- `locations` - สถานที่/แผนก
- `ip_addresses` - IP Address

### ความสัมพันธ์
- User ←→ Device (1:Many)
- Location ←→ Device (1:Many)
- Device ←→ IP Address (1:1)

## API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/profile` - ข้อมูลผู้ใช้

### Assets
- `GET /api/assets` - รายการอุปกรณ์
- `POST /api/assets` - เพิ่มอุปกรณ์
- `PUT /api/assets/:id` - แก้ไขอุปกรณ์
- `DELETE /api/assets/:id` - ลบอุปกรณ์

### Users
- `GET /api/users` - รายการผู้ใช้
- `POST /api/users` - เพิ่มผู้ใช้

### Locations
- `GET /api/locations` - รายการสถานที่
- `POST /api/locations` - เพิ่มสถานที่

## การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อฐานข้อมูล
```bash
# ตรวจสอบ MySQL service
sudo systemctl status mysql

# ตรวจสอบการเชื่อมต่อ
mysql -u root -p -e "SHOW DATABASES;"
```

### ปัญหา CORS
ตรวจสอบไฟล์ `.env` ว่ามี `CORS_ORIGIN=http://localhost:5173`

### ปัญหา JWT
ตรวจสอบ `JWT_SECRET` ในไฟล์ `.env`

## การพัฒนาเพิ่มเติม

### เพิ่ม API Route ใหม่
1. สร้างไฟล์ใน `server/routes/`
2. เพิ่ม route ใน `server/index.js`
3. ทดสอบ API

### เพิ่ม Frontend Component
1. สร้าง component ใน `src/components/`
2. เพิ่ม page ใน `src/pages/`
3. เพิ่ม route ใน `src/App.tsx`

## Security Checklist

- [ ] เปลี่ยนรหัสผ่าน admin เริ่มต้น
- [ ] ตั้งค่า JWT_SECRET ที่แข็งแกร่ง
- [ ] เปิดใช้งาน HTTPS ใน production
- [ ] ตั้งค่า firewall
- [ ] ทำ backup ฐานข้อมูลเป็นประจำ
