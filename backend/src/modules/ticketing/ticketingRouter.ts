import { Router } from 'express';
import { createTicket, getMyTickets } from './ticketingController';
import { authenticate } from '../auth/authMiddleware';

const router = Router();

// GET /api/tickets/my - Get user's tickets
router.get('/my', authenticate, getMyTickets);

// POST /api/tickets - Create a new ticket (All authenticated users can report)
router.post('/', authenticate, createTicket);

export default router;
