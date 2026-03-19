import { Request, Response } from 'express';
import * as repo from './ticketingRepository';
import { logAction } from '../auditlog/auditController';

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { room_id, category_id, description, image_before } = req.body;
    const reporter_id = (req as any).user?.id;

    if (!room_id || !category_id || !description) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check for duplicate active ticket
    const activeTicket = await repo.checkActiveTicket(room_id, category_id);
    if (activeTicket) {
      res.status(409).json({ 
        status: 'error',
        code: 'DUPLICATE_TICKET',
        message: 'There is already an active report for this category in this room.',
        data: activeTicket
      });
      return;
    }

    const ticketId = await repo.insertTicket({
      reporter_id,
      room_id,
      category_id,
      description,
      image_before
    });

    res.status(201).json({ 
      status: 'success', 
      message: 'Ticket created successfully',
      data: { id: ticketId }
    });

    logAction(req, 'TICKET_CREATED', 'TICKETING', { ticket_id: ticketId, room_id, category_id });
  } catch (error) {
    console.error('Error in createTicket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getMyTickets = async (req: Request, res: Response) => {
  try {
    const reporter_id = (req as any).user?.id;
    const tickets = await repo.getTicketsByReporter(reporter_id);
    res.json({ status: 'success', data: { data: tickets } });
  } catch (error) {
    console.error('Error in getMyTickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
