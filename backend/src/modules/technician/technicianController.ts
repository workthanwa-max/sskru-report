import { Request, Response } from 'express';
import * as repo from './technicianRepository';
import { logAction } from '../auditlog/auditController';

export const getAssignedTickets = async (req: Request, res: Response) => {
  try {
    const technicianId = (req as any).user?.id;
    if (!technicianId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const tickets = await repo.getAssignedTickets(technicianId);
    res.json({
      status: 'success',
      data: tickets
    });
  } catch (error) {
    console.error('Error in getAssignedTickets:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getTicketHistory = async (req: Request, res: Response) => {
  try {
    const technicianId = (req as any).user?.id;
    if (!technicianId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const tickets = await repo.getTicketHistory(technicianId);
    res.json({
      status: 'success',
      data: tickets
    });
  } catch (error) {
    console.error('Error in getTicketHistory:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const startTicketHandler = async (req: Request, res: Response) => {
  try {
    const technicianId = (req as any).user?.id;
    const ticketId = parseInt(req.params.id as string);
    if (!technicianId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    await repo.startTicket(ticketId, technicianId);
    res.json({ status: 'success', message: 'Ticket started successfully' });

    logAction(req, 'WORK_STARTED', 'TECHNICIAN', { ticket_id: ticketId });
  } catch (error: any) {
    if (error.message === 'Ticket not found or cannot be started') {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    console.error('Error in startTicketHandler:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const submitTicketHandler = async (req: Request, res: Response) => {
  try {
    const technicianId = (req as any).user?.id;
    const ticketId = parseInt(req.params.id as string);
    const { notes, image_after } = req.body;
    
    if (!technicianId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    if (!notes) return res.status(400).json({ status: 'error', message: 'Notes are required to submit a job' });

    await repo.submitTicket(ticketId, technicianId, notes, image_after);
    res.json({ status: 'success', message: 'Ticket submitted for review' });

    logAction(req, 'WORK_COMPLETED', 'TECHNICIAN', { ticket_id: ticketId, notes });
  } catch (error: any) {
    if (error.message === 'Ticket not found or not in progress') {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    console.error('Error in submitTicketHandler:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
