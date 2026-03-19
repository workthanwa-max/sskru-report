import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../data/database.sqlite');

const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Floors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER,
    floor_number INTEGER,
    FOREIGN KEY (building_id) REFERENCES Buildings(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    floor_id INTEGER,
    room_number TEXT,
    room_name TEXT,
    FOREIGN KEY (floor_id) REFERENCES Floors(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    full_name TEXT,
    role TEXT CHECK(role IN ('Student', 'Admin', 'Technician', 'Manager')),
    department TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_id INTEGER,
    room_id INTEGER,
    category_id INTEGER,
    description TEXT,
    image_before TEXT,
    status TEXT CHECK(status IN ('New', 'Assigned', 'In_Progress', 'Review', 'Closed')) DEFAULT 'New',
    technician_id INTEGER,
    admin_id INTEGER,
    is_rejected INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES Users(id),
    FOREIGN KEY (room_id) REFERENCES Rooms(id),
    FOREIGN KEY (category_id) REFERENCES Categories(id),
    FOREIGN KEY (technician_id) REFERENCES Users(id),
    FOREIGN KEY (admin_id) REFERENCES Users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Maintenance_Logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER,
    action_by INTEGER,
    notes TEXT,
    image_after TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(id),
    FOREIGN KEY (action_by) REFERENCES Users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS AuditLogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    module TEXT,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
  )`);

  // Migration: Add columns if they don't exist
  db.run("ALTER TABLE Tickets ADD COLUMN is_rejected INTEGER DEFAULT 0", (err) => {
    if (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Error adding is_rejected column:', err.message);
      }
    } else {
      console.log('Migration: Added is_rejected column to Tickets table.');
    }
  });
  
  db.run(`ALTER TABLE Tickets ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`, (err) => {
    if (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Error adding updated_at column:', err.message);
      }
    } else {
      console.log('Migration: Added updated_at column to Tickets table.');
    }
  });

  db.run("ALTER TABLE Tickets ADD COLUMN technician_id INTEGER", (err) => {
    if (err && !err.message.includes('duplicate column name')) {}
  });

  db.run("ALTER TABLE Tickets ADD COLUMN admin_id INTEGER", (err) => {
    if (err && !err.message.includes('duplicate column name')) {}
  });

  // Maintenance_Logs Migrations
  db.run("ALTER TABLE Maintenance_Logs ADD COLUMN notes TEXT", (err) => {
    if (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Error adding notes to Maintenance_Logs:', err.message);
      }
    } else {
      console.log('Migration: Added notes column to Maintenance_Logs table.');
    }
  });
  
  db.run("ALTER TABLE Maintenance_Logs ADD COLUMN image_after TEXT", (err) => {
    if (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Error adding image_after to Maintenance_Logs:', err.message);
      }
    } else {
      console.log('Migration: Added image_after column to Maintenance_Logs table.');
    }
  });

  // Users Migrations
  db.run("ALTER TABLE Users ADD COLUMN full_name TEXT", (err) => {
    if (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Error adding full_name to Users:', err.message);
      }
    } else {
      console.log('Migration: Added full_name column to Users table.');
    }
  });

  db.run("ALTER TABLE Users ADD COLUMN department TEXT", (err) => {
    if (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Error adding department to Users:', err.message);
      }
    } else {
      console.log('Migration: Added department column to Users table.');
    }
  });
});

export default db;
