import { Router } from 'express';
import { getStats, getDashboardSummary } from './reportsController';
import { authenticate, authorize } from '../auth/authMiddleware';

const router = Router();

// Secure reports for Admin/Manager
router.use(authenticate);
router.use(authorize(['Admin', 'Manager']));

// GET /api/reports/stats
router.get('/stats', getStats);

// GET /api/reports/dashboard-summary
router.get('/dashboard-summary', getDashboardSummary);

export default router;
