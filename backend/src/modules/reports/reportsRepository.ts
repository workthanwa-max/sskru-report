import db from '../../../config/db';

export const getBuildingStats = () => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT b.id, b.name, b.code, COUNT(t.id) as ticket_count
      FROM Buildings b
      LEFT JOIN Floors f ON b.id = f.building_id
      LEFT JOIN Rooms r ON f.id = r.floor_id
      LEFT JOIN Tickets t ON r.id = t.room_id
      GROUP BY b.id
      ORDER BY ticket_count DESC
    `;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getCategoryStats = () => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT c.category_name, COUNT(t.id) as ticket_count
      FROM Categories c
      LEFT JOIN Tickets t ON c.id = t.category_id
      GROUP BY c.id
      ORDER BY ticket_count DESC
    `;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getAverageRepairTime = () => {
  return new Promise<any>((resolve, reject) => {
    // We calculate the time between ticket creation and the LATEST maintenance log entry for that ticket
    // only for CLOSED tickets.
    // SQLite doesn't have a direct interval, so we use julianday and convert to hours.
    const query = `
      WITH LastLogs AS (
        SELECT ticket_id, MAX(created_at) as last_action_at
        FROM Maintenance_Logs
        GROUP BY ticket_id
      )
      SELECT AVG((julianday(l.last_action_at) - julianday(t.created_at)) * 24) as avg_repair_hours
      FROM Tickets t
      JOIN LastLogs l ON t.id = l.ticket_id
      WHERE t.status = 'Closed'
    `;
    db.get(query, [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const getMonthlyStats = () => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count
      FROM Tickets
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
export const getDashboardSummary = () => {
  return new Promise<any>((resolve, reject) => {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM Tickets WHERE status = 'New') as pending_dispatch,
        (SELECT COUNT(*) FROM Tickets WHERE status = 'In_Progress') as active_repairs,
        (SELECT COUNT(*) FROM Users WHERE role = 'Technician') as staff_total
    `;
    db.get(query, [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};
