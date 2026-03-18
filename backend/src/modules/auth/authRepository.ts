import db from '../../../config/db';

export function findUserByUsername(username: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // EXPRESS-INJECT-001: Using parameterized query
    db.get('SELECT * FROM Users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function saveUser(user: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const { username, password, full_name, role, department } = user;
    db.run(
      'INSERT INTO Users (username, password, full_name, role, department) VALUES (?, ?, ?, ?, ?)',
      [username, password, full_name, role, department],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...user });
      }
    );
  });
}

export function findUserById(id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, username, full_name, role, department FROM Users WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}
