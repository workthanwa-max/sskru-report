import { Request, Response } from 'express';
import * as repo from './reportsRepository';

export const getStats = async (req: Request, res: Response) => {
  try {
    const [buildings, categories, repairTime, monthly] = await Promise.all([
      repo.getBuildingStats(),
      repo.getCategoryStats(),
      repo.getAverageRepairTime(),
      repo.getMonthlyStats()
    ]);

    res.json({
      status: 'success',
      data: {
        buildings,
        categories,
        average_repair_time_hours: repairTime?.avg_repair_hours ? parseFloat(repairTime.avg_repair_hours.toFixed(2)) : 0,
        monthly_trends: monthly
      }
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
