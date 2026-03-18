# Technician Module

This module provides functionalities for technicians to manage their assigned tasks.

## Features
- View assigned tickets
- Start a task (Status -> 'In_Progress')
- Submit completed work (Status -> 'Review')
- View work history

## Endpoints
- `GET /api/technician/tickets`: List 'Assigned' and 'In_Progress' tickets for the logged-in technician.
- `GET /api/technician/history`: List 'Review' and 'Closed' tickets for the logged-in technician.
- `PATCH /api/technician/tickets/:id/start`: Mark an assigned ticket as being worked on.
- `PATCH /api/technician/tickets/:id/submit`: Submit work for review, including notes and completion images.

## Interaction
Technicians can only see tickets assigned to them. When they submit work, it moves to the 'Review' status for Manager approval.
