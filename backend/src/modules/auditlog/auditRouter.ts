import { Router } from 'express';
import { getLogs } from './auditController';
import { authenticate, authorize } from '../auth/authMiddleware';

const router = Router();

// Only Admin can view audit logs
router.get('/', authenticate, authorize(['Admin']), getLogs);

export default router;
