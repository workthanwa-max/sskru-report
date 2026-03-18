import { Router } from 'express';
import { login, register, logout, getMe, refreshToken, getUsers, updateUser, deleteUser } from './authController';
import { authenticate, authorize } from '../auth/authMiddleware';

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

// User Management (Admin Only)
router.get('/users', authenticate, authorize(['Admin']), getUsers);
router.put('/users/:id', authenticate, authorize(['Admin']), updateUser);
router.delete('/users/:id', authenticate, authorize(['Admin']), deleteUser);

export default router;
