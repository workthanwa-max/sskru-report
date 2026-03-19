import db from '../../../config/db';

export const getAssignedTickets = (technicianId: number) => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT t.*, 
             u.full_name as reporter_name,
             r.room_number, r.room_name,
             f.floor_number,
             b.name as building_name,
             c.category_name,
             (SELECT notes FROM Maintenance_Logs WHERE ticket_id = t.id ORDER BY created_at DESC LIMIT 1) as latest_note
      FROM Tickets t
      LEFT JOIN Users u ON t.reporter_id = u.id
      LEFT JOIN Rooms r ON t.room_id = r.id
      LEFT JOIN Floors f ON r.floor_id = f.id
      LEFT JOIN Buildings b ON f.building_id = b.id
      LEFT JOIN Categories c ON t.category_id = c.id
      WHERE t.technician_id = ? AND UPPER(t.status) IN ('ASSIGNED', 'IN_PROGRESS', 'REJECTED')
      ORDER BY COALESCE(t.is_rejected, 0) DESC, COALESCE(t.updated_at, t.created_at) DESC
    `;
    db.all(query, [technicianId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getTicketHistory = (technicianId: number) => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT t.*, 
             u.full_name as reporter_name,
             r.room_number, r.room_name,
             f.floor_number,
             b.name as building_name,
             c.category_name,
             ml.notes as maintenance_notes,
             ml.image_after as maintenance_photo,
             ml.created_at as completion_date
      FROM Tickets t
      LEFT JOIN Users u ON t.reporter_id = u.id
      LEFT JOIN Rooms r ON t.room_id = r.id
      LEFT JOIN Floors f ON r.floor_id = f.id
      LEFT JOIN Buildings b ON f.building_id = b.id
      LEFT JOIN Categories c ON t.category_id = c.id
      LEFT JOIN Maintenance_Logs ml ON t.id = ml.ticket_id
      WHERE t.technician_id = ? AND t.status IN ('Review', 'Closed')
      ORDER BY t.created_at DESC
    `;
    db.all(query, [technicianId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const startTicket = (ticketId: number, technicianId: number) => {
  return new Promise<void>((resolve, reject) => {
    const query = `
      UPDATE Tickets 
      SET status = 'In_Progress', updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND technician_id = ? AND status = 'Assigned'
    `;
    db.run(query, [ticketId, technicianId], function (err) {
      if (err) reject(err);
      else if (this.changes === 0) reject(new Error('Ticket not found or cannot be started'));
      else resolve();
    });
  });
};

export const submitTicket = (ticketId: number, technicianId: number, notes: string, imageAfter: string = '') => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const updateQuery = `
        UPDATE Tickets 
        SET status = 'Review', is_rejected = 0, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND technician_id = ? AND status = 'In_Progress'
      `;
      
      db.run(updateQuery, [ticketId, technicianId], function (err) {
        if (err) {
          db.run('ROLLBACK');
          return reject(err);
        }
        if (this.changes === 0) {
          db.run('ROLLBACK');
          return reject(new Error('Ticket not found or not in progress'));
        }

        const logQuery = `
          INSERT INTO Maintenance_Logs (ticket_id, action_by, notes, image_after)
          VALUES (?, ?, ?, ?)
        `;
        db.run(logQuery, [ticketId, technicianId, notes, imageAfter], function (errLog) {
          if (errLog) {
            db.run('ROLLBACK');
            return reject(errLog);
          }
          db.run('COMMIT');
          resolve();
        });
      });
    });
  });
};
