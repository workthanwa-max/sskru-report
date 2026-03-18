# SSKRU Repair & Maintenance System

ระบบแจ้งซ่อมและจัดการการบำรุงรักษามหาวิทยาลัย (SSKRU) 
ถูกพัฒนาโดยแยกโครงสร้าง Frontend และ Backend ออกจากกันอย่างสมบูรณ์ เพื่อประสิทธิภาพและการบำรุงรักษาในระยะยาว

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS V4, TypeScript, Framer Motion
- **Backend**: Node.js, Express, SQLite3, TypeScript (ts-node)
- **Authentication**: JWT (JSON Web Tokens)

---

## 🚀 วิธีการติดตั้งและรันโปรเจ็กต์ (How to Run)

เนื่องจากโปรเจ็กต์ถูกแบบออกเป็นสองส่วน (Frontend และ Backend) จะต้องเปิด **Terminal 2 หน้าต่าง** ในการรันระบบครับ

### 1. การตั้งค่า Backend (Terminal 1)
เปิด Terminal ค้างไว้ 1 หน้าต่าง แล้วเข้าไปที่โฟลเดอร์ `backend`:
```bash
cd backend
```
ทำการติดตั้ง Dependencies ทั้งหมด:
```bash
npm install
```
การจำลองข้อมูลเริ่มต้น (Seeding) - **สำหรับรันครั้งแรกเท่านั้น**
ระบบมาพร้อมกับบัญชีพื้นฐาน 4 บทบาท เพื่อใช้ทดสอบระบบ (รหัสผ่านเหมือนเข้าสู่ระบบทุกบัญชี):
```bash
npm run seed
```
*(แอคเคาน์ตัวอย่างที่ได้คือ: `admin`, `manager`, `tech`, `student` รหัสผ่านเหมือนชื่อบัญชี)*

เริ่มรันเซิร์ฟเวอร์ Backend:
```bash
npm run dev
```
Backend จะทำงานอยู่ที่: `http://localhost:3000`

---

### 2. การตั้งค่า Frontend (Terminal 2)
เปิด Terminal หน้าต่างที่ 2 แล้วเข้าไปที่โฟลเดอร์ `frontend`:
```bash
cd frontend
```
ทำการติดตั้ง Dependencies ทั้งหมด:
```bash
npm install
```
เริ่มรันเซิร์ฟเวอร์ Frontend:
```bash
npm run dev
```
Frontend จะทำงานอยู่ที่: `http://localhost:5173`

---

## 🔐 ตารางบัญชีสำหรับทดสอบ (Test Accounts)

| Role (บทบาท) | Username | Password | แดชบอร์ดเป้าหมาย |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin` | `/dashboard/admin` |
| **Manager** | `manager` | `manager` | `/dashboard/manager` |
| **Technician** | `tech` | `tech` | `/dashboard/technician` |
| **Student** | `student` | `student` | `/dashboard/student` |

---

## ⚙️ Environment Variables (.env)
โฟลเดอร์แต่ละฝั่งต้องมีไฟล์ `.env` ตามนี้:

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3000/api
```

**`backend/.env`**
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=sskru_secure_jwt_secret_key_123!
```

---
*Developed for SSKRU Maintenance Framework.*
# sskru-report
