import { NextResponse } from 'next/server';

export async function POST() {
  // Since we're using JWTs, there's no server-side session to invalidate
  return NextResponse.json({ message: 'Logged out successfully' });
} 