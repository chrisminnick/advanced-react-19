'use client';

import { useActionState } from 'react';
import { addTaskAction } from '@/app/actions/tasks';
import SubmitButton from './SubmitButton';

const initialState = { ok: false, error: null, title: '', status: 'open' };

// Client Component because of useActionState. The `addTaskAction` it passes
// in is a Server Action (`'use server'` in app/actions/tasks.js).
export default function AddTaskForm() {
  const [state, action] = useActionState(addTaskAction, initialState);

  return (
    <form action={action} className="add-task-form">
      <h3>Add a task</h3>
      <input
        name="title"
        defaultValue={state.title}
        placeholder="What needs doing?"
        autoFocus
        required
        maxLength={100}
      />
      <select name="status" defaultValue={state.status}>
        <option value="open">Open</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
      {state.error && (
        <p role="alert" className="error">{state.error}</p>
      )}
      {state.ok && !state.error && (
        <p role="status" className="success">Task added.</p>
      )}
      <SubmitButton />
    </form>
  );
}
