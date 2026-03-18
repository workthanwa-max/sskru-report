โครงสร้างโมดูล Auth:
- authService.ts: จัดการ logic authentication เช่น hash/check password
- authRouter.ts: กำหนด route เช่น /login /logout /register
- authController.ts: รับ request/response จาก router
- authRepository.ts: ติดต่อฐานข้อมูล เช่นดึง/บันทึก user
- authMiddleware.ts: ตรวจสอบ token/role
