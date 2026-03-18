# Dispatch Module

This module handles ticket management for Admins and Managers, including assignment and inspection of work.

## Features
- List pending tickets
- View available technicians
- Assign tickets to technicians
- Review submitted work
- Approve or Reject work

## Endpoints
- `GET /api/admin/tickets/pending`: Fetch tickets with 'New' status.
- `GET /api/admin/technicians`: Fetch all users with 'Technician' role.
- `PATCH /api/admin/tickets/:id/assign`: Assign a technician to a ticket.
- `GET /api/admin/tickets/review`: Fetch tickets with 'Review' status.
- `PATCH /api/admin/tickets/:id/approve`: Approve work and close the ticket (Status -> 'Closed').
- `PATCH /api/admin/tickets/:id/reject`: Reject work and return it to the technician (Status -> 'In_Progress').

## Workflow
1. Manager views pending tickets.
2. Manager assigns a technician.
3. Once the technician submits, the Manager reviews the work.
4. Manager either closes the ticket or rejects it for further fixes.
