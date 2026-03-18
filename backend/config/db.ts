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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
});

export default db;
