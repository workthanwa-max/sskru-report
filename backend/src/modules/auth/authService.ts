import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_please_change_in_production';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate an access token (expires in 15 minutes as a security best practice)
export function generateToken(payload: object): string {
  // Only include necessary identifiers, not sensitive data
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

// Generate a refresh token (expires in 7 days)
export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
