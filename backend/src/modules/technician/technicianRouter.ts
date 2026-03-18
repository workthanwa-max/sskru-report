import { Router } from 'express';
import { getAssignedTickets, getTicketHistory, startTicketHandler, submitTicketHandler } from './technicianController';
import { authenticate, authorize } from '../auth/authMiddleware';

const router = Router();

// Secure routes for Technicians
router.use(authenticate);
router.use(authorize(['Technician', 'Admin'])); // Admin for debugging if needed

// GET /api/technician/tickets/assigned
router.route('/tickets/assigned')
  .get(getAssignedTickets);

// GET /api/technician/tickets/history
router.route('/tickets/history')
  .get(getTicketHistory);

// PATCH /api/technician/tickets/:id/start
router.route('/tickets/:id/start')
  .patch(startTicketHandler);

// POST /api/technician/tickets/:id/submit
router.route('/tickets/:id/submit')
  .post(submitTicketHandler);

export default router;
