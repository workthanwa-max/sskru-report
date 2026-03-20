import db from '../../../config/db';

export const checkActiveTicket = (roomId: number, categoryId: number) => {
  return new Promise<any | null>((resolve, reject) => {
    const query = `
      SELECT t.*, u.full_name as reporter_name 
      FROM Tickets t
      LEFT JOIN Users u ON t.reporter_id = u.id
      WHERE t.room_id = ? AND t.category_id = ? AND t.status NOT IN ('Closed')
      LIMIT 1
    `;
    db.get(query, [roomId, categoryId], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
};

export const insertTicket = (data: {
  reporter_id: number;
  room_id: number;
  category_id: number;
  description: string;
  image_before?: string;
}) => {
  return new Promise<number>((resolve, reject) => {
    const { reporter_id, room_id, category_id, description, image_before } = data;
    const query = `
      INSERT INTO Tickets (reporter_id, room_id, category_id, description, image_before, status)
      VALUES (?, ?, ?, ?, ?, 'New')
    `;
    db.run(query, [reporter_id, room_id, category_id, description, image_before || ''], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};
export const getTicketsByReporter = (reporterId: number) => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT t.*, 
             r.room_name, r.room_number,
             f.floor_number,
             b.name as building_name,
             c.category_name,
             ml.notes as maintenance_notes,
             ml.image_after as maintenance_photo,
             ml.created_at as completion_date
      FROM Tickets t
      LEFT JOIN Rooms r ON t.room_id = r.id
      LEFT JOIN Floors f ON r.floor_id = f.id
      LEFT JOIN Buildings b ON f.building_id = b.id
      LEFT JOIN Categories c ON t.category_id = c.id
      LEFT JOIN Maintenance_Logs ml ON t.id = ml.ticket_id
      WHERE t.reporter_id = ?
      ORDER BY t.created_at DESC
    `;
    db.all(query, [reporterId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};
