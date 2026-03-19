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
