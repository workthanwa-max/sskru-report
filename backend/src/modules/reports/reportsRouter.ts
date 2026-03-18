import { Router } from 'express';
import { getStats } from './reportsController';
import { authenticate, authorize } from '../auth/authMiddleware';

const router = Router();

// Secure reports for Admin/Manager
router.use(authenticate);
router.use(authorize(['Admin', 'Manager']));

// GET /api/reports/stats
router.get('/stats', getStats);

export default router;
