import { Request, Response } from 'express';
import * as repo from './auditRepository';

export const getLogs = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const logs = await repo.getAuditLogs(limit);
    res.json({ status: 'success', data: logs });
  } catch (error) {
    console.error('Error in getLogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Utility function to log actions from other controllers
export const logAction = async (req: Request, action: string, module: string, details?: any) => {
  try {
    const user_id = (req as any).user?.id;
    const ip_address = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    let detailString = '';
    if (details instanceof Error) {
      detailString = JSON.stringify({ message: details.message, stack: details.stack });
    } else if (typeof details === 'object') {
      detailString = JSON.stringify(details);
    } else {
      detailString = String(details || '');
    }

    await repo.createAuditLog({
      user_id,
      action,
      module,
      details: detailString,
      ip_address: typeof ip_address === 'string' ? ip_address : undefined
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};
