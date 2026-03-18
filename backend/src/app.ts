import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './modules/auth/authRouter';

const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ 
  origin: frontendUrl,
  credentials: true 
}));
app.use(express.json());

// Auth routes
app.use('/api/auth', authRouter);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to SSKRU Backend API',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

export default app;
