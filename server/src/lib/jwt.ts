
import { SignJWT, jwtVerify } from 'jose';
import 'dotenv/config';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

export interface JWTPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
  [propName: string]: unknown; // Add index signature
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload as Record<string, unknown>) // Type assertion here
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    // Explicitly check for expected properties and types
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'id' in payload && typeof payload.id === 'string' &&
      'email' in payload && typeof payload.email === 'string'
    ) {
      // Reconstruct JWTPayload to match our interface, picking only expected properties
      return {
        id: payload.id,
        email: payload.email,
        iat: typeof payload.iat === 'number' ? payload.iat : undefined,
        exp: typeof payload.exp === 'number' ? payload.exp : undefined,
      };
    }
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
