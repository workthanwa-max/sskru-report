import { Router } from 'express';
import {
  getPendingTickets,
  getAvailableTechnicians,
  assignTicketToTechnician,
  getReviewTickets,
  approveTicket,
  rejectTicket
} from './dispatchController';
import { authenticate, authorize } from '../auth/authMiddleware';

const router = Router();

// Secure all dispatch routes for Manager (and Admin as backup)
router.use(authenticate);
router.use(authorize(['Manager', 'Admin']));

// GET /api/admin/tickets/pending
router.route('/tickets/pending')
  .get(getPendingTickets);

// GET /api/admin/technicians
router.route('/technicians')
  .get(getAvailableTechnicians);

// PATCH /api/admin/tickets/:id/assign
router.route('/tickets/:id/assign')
  .patch(assignTicketToTechnician);

// GET /api/admin/tickets/review
router.route('/tickets/review')
  .get(getReviewTickets);

// PATCH /api/admin/tickets/:id/approve
router.route('/tickets/:id/approve')
  .patch(approveTicket);

// PATCH /api/admin/tickets/:id/reject
router.route('/tickets/:id/reject')
  .patch(rejectTicket);

export default router;
