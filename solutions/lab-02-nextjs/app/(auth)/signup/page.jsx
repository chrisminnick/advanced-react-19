import { redirect } from 'next/navigation';
import * as api from '@/app/lib/api.server';
import SignupForm from './SignupForm';

export const metadata = { title: 'Create account' };

async function signupAction(prevState, formData) {
  'use server';

  const email = formData.get('email');
  const password = formData.get('password');
  const displayName = formData.get('displayName');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  try {
    await api.signup({ email, password, displayName });
  } catch (err) {
    if (err.status === 409) return { error: 'That email is already registered.' };
    return { error: err.message };
  }

  redirect('/login');
}

export default function SignupPage() {
  return <SignupForm action={signupAction} />;
}
