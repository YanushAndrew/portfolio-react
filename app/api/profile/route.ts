import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/middleware';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM profiles LIMIT 1');
    
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, title, bio, image_url, skills } = await req.json();
    
    // Check if profile exists
    const checkResult = await pool.query('SELECT * FROM profiles LIMIT 1');
    
    if (checkResult.rows.length === 0) {
      // Create profile if it doesn't exist
      const insertResult = await pool.query(
        'INSERT INTO profiles (name, title, bio, image_url, skills) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, title, bio, image_url, JSON.stringify(skills)]
      );
      
      return NextResponse.json(insertResult.rows[0]);
    } else {
      // Update existing profile
      const updateResult = await pool.query(
        'UPDATE profiles SET name = $1, title = $2, bio = $3, image_url = $4, skills = $5 WHERE id = $6 RETURNING *',
        [name, title, bio, image_url, JSON.stringify(skills), checkResult.rows[0].id]
      );
      
      return NextResponse.json(updateResult.rows[0]);
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
} 