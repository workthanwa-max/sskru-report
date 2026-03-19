import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing. Security critical!');
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate an access token (expires in 12 hours for better UX during development)
export function generateToken(payload: object): string {
  // Only include necessary identifiers, not sensitive data
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '12h' });
}

// Generate a refresh token (expires in 7 days)
export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET!);
}
