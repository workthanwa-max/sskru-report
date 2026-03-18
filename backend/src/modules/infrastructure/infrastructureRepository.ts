import db from '../../../config/db';

const runQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
};

const allQuery = (query: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const getQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// --- Buildings ---
export function findAllBuildings(): Promise<any[]> {
  return allQuery('SELECT * FROM Buildings');
}

export function insertBuilding(name: string, code: string): Promise<any> {
  return runQuery('INSERT INTO Buildings (name, code) VALUES (?, ?)', [name, code]);
}

export function findBuildingById(id: number | string): Promise<any> {
  return getQuery('SELECT * FROM Buildings WHERE id = ?', [id]);
}

export function updateBuildingById(id: number | string, name: string, code: string): Promise<any> {
  return runQuery('UPDATE Buildings SET name = ?, code = ? WHERE id = ?', [name, code, id]);
}

export function deleteBuildingById(id: number | string): Promise<any> {
  return runQuery('DELETE FROM Buildings WHERE id = ?', [id]);
}

// --- Floors ---
export function findAllFloors(): Promise<any[]> {
  return allQuery('SELECT * FROM Floors');
}

export function insertFloor(buildingId: number | string, floorNumber: number | string): Promise<any> {
  return runQuery('INSERT INTO Floors (building_id, floor_number) VALUES (?, ?)', [buildingId, floorNumber]);
}

// --- Rooms ---
export function findAllRooms(): Promise<any[]> {
  return allQuery('SELECT * FROM Rooms');
}

export function insertRoom(floorId: number | string, roomNumber: string, roomName: string): Promise<any> {
  return runQuery('INSERT INTO Rooms (floor_id, room_number, room_name) VALUES (?, ?, ?)', [floorId, roomNumber, roomName]);
}

// --- Categories ---
export function findAllCategories(): Promise<any[]> {
  return allQuery('SELECT * FROM Categories');
}

export function insertCategory(categoryName: string): Promise<any> {
  return runQuery('INSERT INTO Categories (category_name) VALUES (?)', [categoryName]);
}
