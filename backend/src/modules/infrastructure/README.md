# Infrastructure Module

This module manages the physical locations and categories of equipment/issues.

## Features
- Manage Buildings, Floors, and Rooms
- Manage Issue Categories

## Endpoints
- `GET /api/buildings`: List all buildings.
- `GET /api/buildings/:id/floors`: List floors for a specific building.
- `GET /api/floors/:id/rooms`: List rooms on a specific floor.
- `GET /api/categories`: List all ticket categories (e.g., Electrical, Plumbing).

## Data Model
- **Buildings**: name, code
- **Floors**: building_id, floor_number
- **Rooms**: floor_id, room_number, room_name
- **Categories**: category_name
