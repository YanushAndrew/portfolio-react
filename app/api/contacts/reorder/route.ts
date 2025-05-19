import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/middleware';
import pool from '@/lib/db';

export async function PUT(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { orderedIds } = await req.json(); // Expect an array of contact IDs in the new order

    if (!Array.isArray(orderedIds) || orderedIds.some(id => typeof id !== 'string')) {
      return NextResponse.json({ message: 'Invalid payload: orderedIds must be an array of strings.' }, { status: 400 });
    }

    // Begin a transaction
    await pool.query('BEGIN');

    // Update order_index for each contact ID
    // Using a loop for simplicity; for very large lists, consider more optimized batch updates if possible with your pg library.
    for (let i = 0; i < orderedIds.length; i++) {
      const contactId = orderedIds[i];
      const newOrderIndex = i + 1; // order_index is 1-based
      await pool.query('UPDATE contacts SET order_index = $1 WHERE id = $2', [newOrderIndex, contactId]);
    }

    // Commit the transaction
    await pool.query('COMMIT');

    return NextResponse.json({ message: 'Contacts reordered successfully' });

  } catch (error) {
    await pool.query('ROLLBACK'); // Rollback transaction on error
    console.error('Reorder contacts error:', error);
    return NextResponse.json({ message: 'Server error during reorder' }, { status: 500 });
  }
} 