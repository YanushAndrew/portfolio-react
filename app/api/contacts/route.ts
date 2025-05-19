import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/middleware';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY order_index ASC, type ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { type, value, url, icon } = await req.json();
    
    // Get the current max order_index
    const maxOrderResult = await pool.query('SELECT MAX(order_index) as max_order FROM contacts');
    const nextOrderIndex = (maxOrderResult.rows[0].max_order || 0) + 1;

    const result = await pool.query(
      'INSERT INTO contacts (type, value, url, icon, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [type, value, url, icon, nextOrderIndex]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Create contact error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
} 