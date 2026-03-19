import { Request, Response } from 'express';
import * as repo from './dispatchRepository';
import { logAction } from '../auditlog/auditController';

export const getPendingTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await repo.getPendingTickets();
    res.json({
      status: 'success',
      data: tickets
    });
  } catch (error) {
    console.error('Error in getPendingTickets:', error);
    logAction(req, 'FETCH_PENDING_ERROR', 'DISPATCH', error);
    res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Internal server error' });
  }
};

export const getAvailableTechnicians = async (req: Request, res: Response) => {
  try {
    const technicians = await repo.getTechnicians();
    res.json({
      status: 'success',
      data: technicians
    });
  } catch (error) {
    console.error('Error in getAvailableTechnicians:', error);
    logAction(req, 'FETCH_TECHS_ERROR', 'DISPATCH', error);
    res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Internal server error' });
  }
};

export const assignTicketToTechnician = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id as string);
    const { technician_id } = req.body;
    
    // Support either req.user.id or fallback if not properly attached by auth middleware
    const adminId = (req as any).user?.id || 1; // Assuming 1 as fallback for seeded admin

    if (!technician_id) {
      return res.status(400).json({ status: 'error', message: 'technician_id is required' });
    }

    await repo.assignTicket(ticketId, technician_id, adminId);
    
    res.json({
      status: 'success',
      message: 'Ticket assigned successfully'
    });

    logAction(req, 'TICKET_ASSIGNED', 'DISPATCH', { ticket_id: ticketId, technician_id, admin_id: adminId });
  } catch (error: any) {
    console.error('Error in assignTicketToTechnician:', error);
    logAction(req, 'ASSIGN_TICKET_ERROR', 'DISPATCH', error);
    if (error.message === 'Ticket not found or already assigned') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
};

export const getReviewTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await repo.getReviewTickets();
    res.json({
      status: 'success',
      data: tickets
    });
  } catch (error) {
    console.error('Error in getReviewTickets:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const approveTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id as string);
    const adminId = (req as any).user?.id || 1;

    await repo.approveTicket(ticketId, adminId);
    res.json({
      status: 'success',
      message: 'Ticket approved and closed successfully'
    });

    logAction(req, 'TICKET_APPROVED', 'DISPATCH', { ticket_id: ticketId, admin_id: adminId });
  } catch (error: any) {
    console.error('Error in approveTicket:', error);
    logAction(req, 'APPROVE_TICKET_ERROR', 'DISPATCH', error);
    if (error.message === 'Ticket not found or not in review') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const rejectTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id as string);
    const adminId = (req as any).user?.id || 1;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ status: 'error', message: 'Rejection reason is required' });
    }

    await repo.rejectTicket(ticketId, adminId, reason);
    res.json({
      status: 'success',
      message: 'Ticket rejected and returned to technician'
    });

    logAction(req, 'TICKET_REJECTED', 'DISPATCH', { ticket_id: ticketId, reason, admin_id: adminId });
  } catch (error: any) {
    console.error('Error in rejectTicket:', error);
    logAction(req, 'REJECT_TICKET_ERROR', 'DISPATCH', error);
    if (error.message === 'Ticket not found or not in review') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
export const getTicketHistory = async (req: Request, res: Response) => {
  try {
    const tickets = await repo.getTicketHistory();
    res.json({
      status: 'success',
      data: tickets
    });
  } catch (error) {
    console.error('Error in getTicketHistory:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
export const getTechnicianDetails = async (req: Request, res: Response) => {
  try {
    const technicianId = parseInt(req.params.id as string);
    const details = await repo.getTechnicianDetails(technicianId);
    
    if (!details) {
      return res.status(404).json({ status: 'error', message: 'Technician not found' });
    }

    res.json({
      status: 'success',
      data: details
    });
  } catch (error) {
    console.error('Error in getTechnicianDetails:', error);
    res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Internal server error' });
  }
};

export const getTechnicianWorkHistory = async (req: Request, res: Response) => {
  try {
    const technicianId = parseInt(req.params.id as string);
    const history = await repo.getTechnicianWorkHistory(technicianId);
    
    res.json({
      status: 'success',
      data: history
    });
  } catch (error) {
    console.error('Error in getTechnicianWorkHistory:', error);
    res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Internal server error' });
  }
};
