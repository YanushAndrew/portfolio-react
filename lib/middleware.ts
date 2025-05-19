import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function authenticateToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_change_in_production');
    return user;
  } catch (error) {
    return null;
  }
} 