import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/middleware';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { title, description, image_url, technologies, github_url, live_url } = await req.json();
    
    const result = await pool.query(
      'INSERT INTO projects (title, description, image_url, technologies, github_url, live_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, image_url, JSON.stringify(technologies), github_url, live_url]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
} 