import db from '../config/db';
import { hashPassword } from './modules/auth/authService';

const seedUsers = [
  { username: 'admin', role: 'Admin', full_name: 'Administrator', department: 'IT' },
  { username: 'manager', role: 'Manager', full_name: 'System Manager', department: 'Management' },
  { username: 'tech', role: 'Technician', full_name: 'Head Technician', department: 'Maintenance' },
  { username: 'student', role: 'Student', full_name: 'Test Student', department: 'SE' }
];

async function runSeed() {
  console.log('Seeding database with default users...');

  for (const user of seedUsers) {
    try {
      // Check if user exists
      const exists = await new Promise<boolean>((resolve, reject) => {
        db.get('SELECT id FROM Users WHERE username = ?', [user.username], (err, row) => {
          if (err) reject(err);
          resolve(!!row);
        });
      });

      if (!exists) {
        // The password is the same as the username for easy testing
        const hashedPassword = await hashPassword(user.username);
        
        await new Promise<void>((resolve, reject) => {
          db.run(
            'INSERT INTO Users (username, password, full_name, role, department) VALUES (?, ?, ?, ?, ?)',
            [user.username, hashedPassword, user.full_name, user.role, user.department],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
        console.log(`✅ Seeded user: ${user.username} (Role: ${user.role})`);
      } else {
        console.log(`⏭️  User ${user.username} already exists. Skipping.`);
      }
    } catch (error) {
      console.error(`❌ Error seeding user ${user.username}:`, error);
    }
  }

  console.log('Seeding completed.');
  // Give it a moment to complete any pending writes then exit
  setTimeout(() => process.exit(0), 1000);
}

runSeed();
