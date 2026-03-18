import { Router } from 'express';
import { login, register, logout, getMe, refreshToken } from './authController';
import { authenticate } from './authMiddleware';

const router = Router();

// Auth router: กำหนด route เช่น /login /logout /register

// POST /api/auth/register : สร้างบัญชีใหม่
router.post('/register', register);

// POST /api/auth/login : ตรวจสอบ Username/Password และคืนค่า Token (JWT) พร้อม Role
router.post('/login', login);

// POST /api/auth/logout : ยกเลิก Token
router.post('/logout', authenticate, logout);

// GET /api/auth/me : ดูข้อมูลโปรไฟล์ตัวเองและสิทธิ์ที่มี
router.get('/me', authenticate, getMe);

// POST /api/auth/refresh : ต่ออายุ Token เมื่อหมดเวลา
router.post('/refresh', refreshToken);

export default router;
