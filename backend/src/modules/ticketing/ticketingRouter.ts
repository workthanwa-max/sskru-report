import { Router } from 'express';
import { createTicket } from './ticketingController';
import { authenticate } from '../auth/authMiddleware';

const router = Router();

// POST /api/tickets - Create a new ticket (All authenticated users can report)
router.post('/', authenticate, createTicket);

export default router;
