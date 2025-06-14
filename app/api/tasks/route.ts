// app/api/tasks/route.ts
import { openDb } from "../../../db/config"; // Adjust path as needed
import { NextResponse } from 'next/server'; // Import NextResponse for App Router responses

// --- GET Request Handler ---
export async function GET(request: Request) {
  const db = await openDb();
  try {
    const tasks = await db.all('SELECT * FROM tasks');
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Database GET error:', error);
    return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
  }
}

// --- POST Request Handler ---
export async function POST(request: Request) {
  const db = await openDb();
  try {
    const { name, day, category } = await request.json(); // Get body from request.json()

    // Ensure 'date' matches your 'day' column name if that's what you used in DB schema
    const result = await db.run(
      'INSERT INTO tasks (name, day, checked, category) VALUES (?, ?, ?, ?)',
      [name, day, 0, category]
    );

    // *** IMPORTANT: Corrected 'users' to 'tasks' table name here ***
    const newTask = await db.get(
      'SELECT * FROM tasks WHERE id = ?',
      [result.lastID]
    );

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Database POST error:', error);
    return NextResponse.json({ error: 'Failed to create task', details: (error as Error).message }, { status: 500 });
  }
}

// --- PUT Request Handler ---
export async function PUT(request: Request) {
  const db = await openDb();
  try {
    // Get query parameters from URL object
    const { searchParams } = new URL(request.url);
    const updateId = searchParams.get('id');

    const { name: updateName, checked: updateChecked, category:updateCategory, date:updateDate} = await request.json(); // Get body

    if (!updateId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const existingTask = await db.get('SELECT * FROM tasks WHERE id = ?', [updateId]);

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updateResult = await db.run(
      'UPDATE tasks SET name = ?, checked = ?, category = ?, day = ? WHERE id = ?',
      [updateName, updateChecked, updateCategory, updateDate, updateId]
    );

    if (updateResult.changes === 0) {
      // No changes if values are identical, return existing task
      return NextResponse.json(existingTask, { status: 200 });
    }

    const updatedTask = await db.get('SELECT * FROM tasks WHERE id = ?', [updateId]);
    return NextResponse.json(updatedTask, { status: 200 });

  } catch (error) {
    console.error('Error updating task:', error);
    if ((error as Error).message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'Task name already exists' }, { status: 409 });
    } else {
      return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
    }
  }
}

// --- DELETE Request Handler ---
export async function DELETE(request: Request) {
  const db = await openDb();
  try {
    // Get query parameters from URL object
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const deleteResult = await db.run('DELETE FROM tasks WHERE id = ?', [id]);

    if (deleteResult.changes === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    } else {
      return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
  }
}