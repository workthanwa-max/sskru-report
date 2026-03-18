import db from '../../../config/db';

export interface AuditLogEntry {
  user_id?: number;
  action: string;
  module?: string;
  details?: string;
  ip_address?: string;
}

export const createAuditLog = (entry: AuditLogEntry) => {
  return new Promise<void>((resolve, reject) => {
    const { user_id, action, module, details, ip_address } = entry;
    const query = `
      INSERT INTO AuditLogs (user_id, action, module, details, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [user_id || null, action, module || null, details || null, ip_address || null], (err) => {
      if (err) {
        console.error('Failed to write audit log:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const getAuditLogs = (limit: number = 100) => {
  return new Promise<any[]>((resolve, reject) => {
    const query = `
      SELECT a.*, u.username as actor_name 
      FROM AuditLogs a
      LEFT JOIN Users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `;
    db.all(query, [limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
