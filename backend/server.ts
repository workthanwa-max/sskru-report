import 'dotenv/config';
import app from './src/app';
import './config/db'; // เชื่อมต่อฐานข้อมูลและสร้างตาราง
import { seedDatabase } from './src/seed';

const PORT = process.env.PORT || 3000;

// Auto-seed if needed
seedDatabase().catch(err => console.error('Auto-seeding failed:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
