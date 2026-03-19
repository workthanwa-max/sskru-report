import db from '../../../config/db';

export const getPendingTickets = () => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT t.*, 
             u.full_name as reporter_name,
             r.room_number, r.room_name,
             f.floor_number,
             b.name as building_name,
             c.category_name
      FROM Tickets t
      LEFT JOIN Users u ON t.reporter_id = u.id
      LEFT JOIN Rooms r ON t.room_id = r.id
      LEFT JOIN Floors f ON r.floor_id = f.id
      LEFT JOIN Buildings b ON f.building_id = b.id
      LEFT JOIN Categories c ON t.category_id = c.id
      WHERE t.status = 'New'
      ORDER BY t.created_at DESC
    `;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getTechnicians = () => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT u.id, u.username, u.full_name, u.role, u.department,
             (SELECT COUNT(*) FROM Tickets t 
              WHERE t.technician_id = u.id 
              AND t.status IN ('Assigned', 'In_Progress', 'Review')) as active_tickets_count
      FROM Users u
      WHERE u.role = 'Technician'
    `;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const assignTicket = (ticketId: number, technicianId: number, adminId: number) => {
  return new Promise<void>((resolve, reject) => {
    // Check if technician already has active tasks
    const checkQuery = `
      SELECT COUNT(*) as count FROM Tickets 
      WHERE technician_id = ? AND status IN ('Assigned', 'In_Progress', 'Review')
    `;
    
    db.get(checkQuery, [technicianId], (checkErr, row: any) => {
      if (checkErr) return reject(checkErr);
      if (row.count > 0) return reject(new Error('Technician already has an active task. Each technician can only handle one task at a time.'));

      const query = `
        UPDATE Tickets 
        SET technician_id = ?, admin_id = ?, status = 'Assigned', updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status = 'New'
      `;
      db.run(query, [technicianId, adminId, ticketId], function (err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Ticket not found or already assigned'));
        else resolve();
      });
    });
  });
};

export const getReviewTickets = () => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT t.*, 
             u.full_name as reporter_name,
             r.room_number, r.room_name,
             f.floor_number,
             b.name as building_name,
             c.category_name,
             tech.full_name as technician_name
      FROM Tickets t
      LEFT JOIN Users u ON t.reporter_id = u.id
      LEFT JOIN Rooms r ON t.room_id = r.id
      LEFT JOIN Floors f ON r.floor_id = f.id
      LEFT JOIN Buildings b ON f.building_id = b.id
      LEFT JOIN Categories c ON t.category_id = c.id
      LEFT JOIN Users tech ON t.technician_id = tech.id
      WHERE t.status = 'Review'
      ORDER BY t.created_at DESC
    `;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const approveTicket = (ticketId: number, adminId: number) => {
  return new Promise<void>((resolve, reject) => {
    const query = `
      UPDATE Tickets 
      SET status = 'Closed', admin_id = ?, is_rejected = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'Review'
    `;
    db.run(query, [adminId, ticketId], function (err) {
      if (err) reject(err);
      else if (this.changes === 0) reject(new Error('Ticket not found or not in review'));
      else resolve();
    });
  });
};

export const rejectTicket = (ticketId: number, adminId: number, reason: string) => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const updateQuery = `
        UPDATE Tickets 
        SET status = 'In_Progress', admin_id = ?, is_rejected = 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status = 'Review'
      `;
      
      db.run(updateQuery, [adminId, ticketId], function (err) {
        if (err) {
          db.run('ROLLBACK');
          return reject(err);
        }
        if (this.changes === 0) {
          db.run('ROLLBACK');
          return reject(new Error('Ticket not found or not in review'));
        }

        const logQuery = `
          INSERT INTO Maintenance_Logs (ticket_id, action_by, notes)
          VALUES (?, ?, ?)
        `;
        const rejectionNote = `REJECTED: ${reason}`;
        
        db.run(logQuery, [ticketId, adminId, rejectionNote], function (errLog) {
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
export const getTicketHistory = () => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT t.*, 
             u.full_name as reporter_name,
             r.room_number, r.room_name,
             f.floor_number,
             b.name as building_name,
             c.category_name,
             tech.full_name as technician_name,
             ml.notes as maintenance_notes,
             ml.image_after as maintenance_photo,
             ml.created_at as completion_date
      FROM Tickets t
      LEFT JOIN Users u ON t.reporter_id = u.id
      LEFT JOIN Rooms r ON t.room_id = r.id
      LEFT JOIN Floors f ON r.floor_id = f.id
      LEFT JOIN Buildings b ON f.building_id = b.id
      LEFT JOIN Categories c ON t.category_id = c.id
      LEFT JOIN Users tech ON t.technician_id = tech.id
      LEFT JOIN Maintenance_Logs ml ON t.id = ml.ticket_id
      WHERE t.status = 'Closed'
      ORDER BY t.updated_at DESC
    `;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getTechnicianDetails = (technicianId: number) => {
  return new Promise<any>((resolve, reject) => {
    // Get technician info and active tasks
    const infoQuery = `
      SELECT u.id, u.username, u.full_name, u.role, u.department,
             (SELECT COUNT(*) FROM Tickets WHERE technician_id = u.id AND status IN ('Assigned', 'In_Progress', 'Review')) as active_count,
             (SELECT COUNT(*) FROM Tickets WHERE technician_id = u.id AND status = 'Closed') as completed_count
      FROM Users u
      WHERE u.id = ? AND u.role = 'Technician'
    `;
    
    db.get(infoQuery, [technicianId], (err, info: any) => {
      if (err) return reject(err);
      if (!info) return resolve(null);

      const activeTasksQuery = `
        SELECT t.*, c.category_name, r.room_number, b.name as building_name
        FROM Tickets t
        LEFT JOIN Categories c ON t.category_id = c.id
        LEFT JOIN Rooms r ON t.room_id = r.id
        LEFT JOIN Floors f ON r.floor_id = f.id
        LEFT JOIN Buildings b ON f.building_id = b.id
        WHERE t.technician_id = ? AND t.status IN ('Assigned', 'In_Progress', 'Review')
        ORDER BY t.created_at DESC
      `;
      
      db.all(activeTasksQuery, [technicianId], (errTasks, tasks) => {
        if (errTasks) return reject(errTasks);
        resolve({ ...info, active_tasks: tasks });
      });
    });
  });
};

export const getTechnicianWorkHistory = (technicianId: number) => {
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
      WHERE t.technician_id = ? AND t.status = 'Closed'
      ORDER BY t.updated_at DESC
    `;
    db.all(query, [technicianId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
