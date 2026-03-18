import 'dotenv/config';
import app from './src/app';
import './config/db'; // เชื่อมต่อฐานข้อมูลและสร้างตาราง

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
