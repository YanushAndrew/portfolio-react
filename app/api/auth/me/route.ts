import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/middleware';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    
    if (!user || !('id' in user)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT id, username, created_at, updated_at FROM users WHERE id = $1',
      [user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
} 