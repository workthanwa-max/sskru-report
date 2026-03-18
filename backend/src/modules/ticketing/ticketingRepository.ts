import db from '../../../config/db';

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
