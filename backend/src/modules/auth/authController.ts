import { Request, Response } from 'express';
import { findUserByUsername, findUserById } from './authRepository';
import { comparePassword, generateToken, generateRefreshToken } from './authService';
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response): Promise<void> {
  // ... existing code ...
  try {
    const { username, password } = req.body;
    
    // EXPRESS-INPUT-001: Treat all user input as untrusted and validate it
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    const user = await findUserByUsername(username);
    if (!user) {
       // Using generic message for invalid credentials to avoid username enumeration
       res.status(401).json({ error: 'Invalid credentials' });
       return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
       res.status(401).json({ error: 'Invalid credentials' });
       return;
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, full_name, role, department } = req.body;
    
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    const { hashPassword } = await import('./authService');
    const hashedPassword = await hashPassword(password);
    
    const { saveUser } = await import('./authRepository');
    const newUser = await saveUser({
      username,
      password: hashedPassword,
      full_name: full_name || '',
      role: role || 'Student',
      department: department || ''
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function logout(req: Request, res: Response): void {
  // In a stateless JWT approach, the client handles logout by destroying the token
  res.json({ message: 'Logged out successfully' });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function refreshToken(req: Request, res: Response): void {
  const { refresh_token } = req.body;
  
  if (!refresh_token || typeof refresh_token !== 'string') {
      res.status(400).json({ error: 'Refresh token required' });
      return;
  }
  
  try {
     const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_please_change_in_production';
     const decoded: any = jwt.verify(refresh_token, JWT_SECRET);
     
     const payload = {
       id: decoded.id,
       username: decoded.username,
       role: decoded.role
     };
     const access_token = generateToken(payload);
     res.json({ access_token });
  } catch (error) {
     res.status(401).json({ error: 'Invalid refresh token' });
  }
}
