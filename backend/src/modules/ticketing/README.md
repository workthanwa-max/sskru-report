# Ticketing Module

This module serves as the central point for the ticketing system's data and overarching logic.

## Overview
While specific operations are handled by the `dispatch` (Admin) and `technician` modules, the `Ticketing` system as a whole manages the lifecycle of a maintenance request.

## Ticket Statuses
- **New**: Ticket has been reported by a user and is waiting for assignment.
- **Assigned**: A technician has been assigned to the ticket.
- **In_Progress**: The technician has started working on the ticket.
- **Review**: The technician has submitted the work for inspection.
- **Closed**: The manager has approved the work and the ticket is finalized.

## Maintenance Logs
Each ticket tracks its progress through the `Maintenance_Logs` table, storing:
- Action taken
- Notes (including rejection reasons)
- Completion images
- Timestamp
