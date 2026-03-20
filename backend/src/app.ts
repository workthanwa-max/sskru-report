import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './modules/auth/authRouter';
import infrastructureRouter from './modules/infrastructure/infrastructureRouter';
import dispatchRouter from './modules/dispatch/dispatchRouter';
import technicianRouter from './modules/technician/technicianRouter';
import reportsRouter from './modules/reports/reportsRouter';
import ticketingRouter from './modules/ticketing/ticketingRouter';
import auditlogRouter from './modules/auditlog/auditRouter';
import uploadRouter from './modules/fileupload/uploadRouter';
import path from 'path';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Main API Routes
app.use('/api/auth', authRouter);
app.use('/api/infrastructure', infrastructureRouter);
app.use('/api/dispatch', dispatchRouter);
app.use('/api/technician', technicianRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/tickets', ticketingRouter);
app.use('/api/audit', auditlogRouter);
app.use('/api/upload', uploadRouter);

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to SSKRU Backend API',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

export default app;
