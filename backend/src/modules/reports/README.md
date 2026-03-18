# Reports Module

This module provides analytical insights and statistics for the SSKRU Report system.

## Features
- Building-wise ticket statistics
- Category-wise issue distribution
- Average repair time calculation
- Monthly ticket trends

## Endpoints
- `GET /api/reports/stats`: Retrieves a comprehensive summary of system statistics.
    - Requires Admin or Manager privileges.
    - Data included:
        - `buildings`: List of buildings and their ticket counts.
        - `categories`: Distribution of issues by category.
        - `average_repair_time_hours`: Calculated from ticket creation to final log submission.
        - `monthly_trends`: Ticket volume over the last 12 months.
