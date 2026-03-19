import db from '../config/db';
import { hashPassword } from './modules/auth/authService';

const seedUsers = [
  { username: 'admin', role: 'Admin', full_name: 'Administrator', department: 'IT' },
  { username: 'manager', role: 'Manager', full_name: 'System Manager', department: 'Management' },
  { username: 'tech', role: 'Technician', full_name: 'Head Technician', department: 'Maintenance' },
  { username: 'student', role: 'Student', full_name: 'Test Student', department: 'SE' }
];

export async function seedDatabase() {
  console.log('--- Initializing & Seeding Database ---');
  console.log('Seeding default users...');

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
      }
    } catch (error) {
      console.error(`❌ Error seeding user ${user.username}:`, error);
    }
  }

  await seedInfrastructure();
  await seedTickets();

  console.log('--- Seeding completed. ---');
}

async function seedInfrastructure() {
  console.log('Seeding default infrastructure data...');

  const insert = (query: string, params: any[]) => {
    return new Promise<void>((resolve, reject) => {
      db.run(query, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  try {
    // Categories
    const categories = ['Electrical', 'Plumbing', 'HVAC', 'Furniture', 'Network'];
    for (const cat of categories) {
      await insert('INSERT OR IGNORE INTO Categories (category_name) VALUES (?)', [cat]);
    }
    
    // Buildings
    await insert('INSERT OR IGNORE INTO Buildings (id, name, code) VALUES (1, "Engineering Building", "ENG")', []);
    await insert('INSERT OR IGNORE INTO Buildings (id, name, code) VALUES (2, "Science Building", "SCI")', []);

    // Floors
    await insert('INSERT OR IGNORE INTO Floors (id, building_id, floor_number) VALUES (1, 1, "1")', []);
    await insert('INSERT OR IGNORE INTO Floors (id, building_id, floor_number) VALUES (2, 1, "2")', []);
    await insert('INSERT OR IGNORE INTO Floors (id, building_id, floor_number) VALUES (3, 2, "1")', []);

    // Rooms
    await insert('INSERT OR IGNORE INTO Rooms (id, floor_id, room_number, room_name) VALUES (1, 1, "101", "Lecture Hall A")', []);
    await insert('INSERT OR IGNORE INTO Rooms (id, floor_id, room_number, room_name) VALUES (2, 1, "102", "Lab 1")', []);
    await insert('INSERT OR IGNORE INTO Rooms (id, floor_id, room_number, room_name) VALUES (3, 2, "201", "Server Room")', []);
    await insert('INSERT OR IGNORE INTO Rooms (id, floor_id, room_number, room_name) VALUES (4, 3, "S101", "Chemistry Lab")', []);

    console.log('✅ Infrastructure seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding infrastructure:', error);
  }
}

async function seedTickets() {
  console.log('Seeding dummy tickets...');
  const insert = (query: string, params: any[]) => {
    return new Promise<void>((resolve, reject) => {
      db.run(query, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  try {
    await insert(
      'INSERT OR IGNORE INTO Tickets (id, reporter_id, room_id, category_id, description, status) VALUES (1, 4, 1, 1, "AC in Lecture Hall A is leaking water.", "New")',
      []
    );
    await insert(
      'INSERT OR IGNORE INTO Tickets (id, reporter_id, room_id, category_id, description, status) VALUES (2, 4, 3, 5, "No internet connection in Server Room.", "New")',
      []
    );
    await insert(
      'INSERT OR IGNORE INTO Tickets (id, reporter_id, room_id, category_id, description, status, technician_id, admin_id) VALUES (3, 4, 2, 2, "Sink is broken.", "Assigned", 3, 2)',
      []
    );

    console.log('✅ Dummy Tickets seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding tickets:', error);
  }
}
