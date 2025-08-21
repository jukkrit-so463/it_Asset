# การจัดการข้อมูล - IT Asset Management System

## คำสั่งสำหรับจัดการข้อมูล

### 📥 เพิ่มข้อมูลตัวอย่าง
```bash
npm run seed-data
```
**ผลลัพธ์:**
- เพิ่ม 5 สถานที่ (ฝ่ายผลิต, บัญชี, บุคคล, ไอที)
- เพิ่ม 5 ผู้ใช้งาน (admin, user1, user2, user3, itadmin)
- เพิ่ม 10 ครุภัณฑ์ (Computer, Printer, Scanner, Server, Network Switch)
- เพิ่ม 6 IP Addresses

### 🗑️ เคลียร์ข้อมูลตัวอย่าง
```bash
npm run clear-data
```
**ผลลัพธ์:**
- ลบข้อมูลตัวอย่างทั้งหมด
- เก็บ admin user ไว้
- รีเซ็ต auto increment counters
- เหลือเพียง admin user ในระบบ

### 🗑️ เคลียร์ข้อมูลทั้งหมด
```bash
npm run clear-all-data
```
**ผลลัพธ์:**
- ลบข้อมูลทั้งหมดรวมถึง admin user
- รีเซ็ต auto increment counters
- ระบบจะไม่มีผู้ใช้งานใดๆ

## ข้อมูลตัวอย่างที่เพิ่มเข้ามา

### 👥 ผู้ใช้งาน (Users)
| Username | Password | Role | ชื่อ-นามสกุล | ตำแหน่ง |
|----------|----------|------|-------------|---------|
| admin | admin123 | admin | Admin | ผู้ดูแลระบบ |
| user1 | password123 | user | สมชาย ใจดี | พนักงาน |
| user2 | password123 | user | สมหญิง รักดี | หัวหน้างาน |
| user3 | password123 | user | สมศักดิ์ มั่นคง | ผู้จัดการ |
| itadmin | password123 | admin | ไอที แอดมิน | ผู้ดูแลระบบ |

### 📍 สถานที่ (Locations)
| ID | ฝ่าย | แผนก | สถานะ |
|----|------|------|-------|
| 1 | ฝ่ายผลิต | แผนกผลิต 1 | active |
| 2 | ฝ่ายผลิต | แผนกผลิต 2 | active |
| 3 | ฝ่ายบัญชี | แผนกบัญชี | active |
| 4 | ฝ่ายบุคคล | แผนกบุคคล | active |
| 5 | ฝ่ายไอที | แผนกไอที | active |

### 💻 ครุภัณฑ์ (Devices)
| ID | ประเภท | Service Tag | ผู้รับผิดชอบ | สถานที่ | สถานะ |
|----|--------|-------------|-------------|---------|-------|
| 1 | Computer | LEN-001 | user1 | ฝ่ายผลิต-แผนกผลิต 1 | active |
| 2 | Computer | HP-002 | user2 | ฝ่ายผลิต-แผนกผลิต 2 | active |
| 3 | Computer | DELL-003 | user3 | ฝ่ายบัญชี-แผนกบัญชี | active |
| 4 | Computer | LEN-004 | itadmin | ฝ่ายไอที-แผนกไอที | active |
| 5 | Printer | HP-PRINT-001 | user1 | ฝ่ายผลิต-แผนกผลิต 1 | active |
| 6 | Printer | CANON-PRINT-002 | user2 | ฝ่ายผลิต-แผนกผลิต 2 | in_repair |
| 7 | Scanner | EPSON-SCAN-001 | user3 | ฝ่ายบัญชี-แผนกบัญชี | active |
| 8 | Server | DELL-SRV-001 | itadmin | ฝ่ายไอที-แผนกไอที | active |
| 9 | Network Switch | CISCO-SW-001 | user1 | ฝ่ายผลิต-แผนกผลิต 1 | active |
| 10 | Computer | LEN-005 | user2 | ฝ่ายผลิต-แผนกผลิต 2 | decommissioned |

### 🌐 IP Addresses
| ID | IP Address | Network Level | Device | สถานะ |
|----|------------|---------------|--------|-------|
| 1 | 192.168.1.100 | 55 | Computer LEN-001 | in_use |
| 2 | 192.168.1.101 | 55 | Computer HP-002 | in_use |
| 3 | 192.168.1.102 | 55 | Computer DELL-003 | in_use |
| 4 | 192.168.1.103 | 55 | Computer LEN-004 | in_use |
| 5 | 192.168.1.10 | 55 | Server DELL-SRV-001 | in_use |
| 6 | 192.168.1.1 | 55 | Network Switch CISCO-SW-001 | in_use |

## ขั้นตอนการรีเซ็ตระบบ

### 1. เคลียร์ข้อมูลทั้งหมด
```bash
npm run clear-all-data
```

### 2. สร้าง Admin User
```bash
npm run create-admin
```

### 3. เพิ่มข้อมูลตัวอย่าง (Optional)
```bash
npm run seed-data
```

### 4. เริ่มระบบ
```bash
npm run dev:full
```

## การสำรองข้อมูล

### สำรองฐานข้อมูล
```bash
mysqldump -u root -p it_asset_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### กู้คืนฐานข้อมูล
```bash
mysql -u root -p it_asset_db < backup_20241201_143022.sql
```

## การตรวจสอบข้อมูล

### ตรวจสอบจำนวนข้อมูล
```sql
SELECT 
  (SELECT COUNT(*) FROM users) as user_count,
  (SELECT COUNT(*) FROM locations) as location_count,
  (SELECT COUNT(*) FROM devices) as device_count,
  (SELECT COUNT(*) FROM ip_addresses) as ip_count;
```

### ตรวจสอบข้อมูลล่าสุด
```sql
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Locations', COUNT(*) FROM locations
UNION ALL
SELECT 'Devices', COUNT(*) FROM devices
UNION ALL
SELECT 'IP Addresses', COUNT(*) FROM ip_addresses;
```

## หมายเหตุสำคัญ

### ⚠️ คำเตือน
- `clear-all-data` จะลบข้อมูลทั้งหมดรวมถึง admin user
- หลังรัน `clear-all-data` ต้องรัน `create-admin` ใหม่
- ข้อมูลที่ถูกลบไม่สามารถกู้คืนได้ (ยกเว้นมี backup)

### 🔄 Auto Increment
- หลังเคลียร์ข้อมูล auto increment จะถูกรีเซ็ต
- ID ใหม่จะเริ่มจาก 1 (หรือ 2 สำหรับ users หลัง clear-data)

### 🗂️ Foreign Key Constraints
- การลบข้อมูลจะทำตามลำดับ dependency
- IP Addresses → Devices → Users → Locations
