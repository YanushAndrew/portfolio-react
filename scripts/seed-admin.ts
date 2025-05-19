import pool from '../lib/db';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    // Check if a user already exists
    const checkResult = await pool.query('SELECT * FROM users LIMIT 1');
    
    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin_admin', 10);
    
    // Insert admin user
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      ['admin-admin', hashedPassword]
    );
    
    console.log('Admin user created:', result.rows[0]);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the seed function
seedAdmin(); 