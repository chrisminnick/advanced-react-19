import Link from 'next/link';
import { redirect } from 'next/navigation';
import * as api from '@/app/lib/api.server';
import { setSessionCookie } from '@/app/lib/session';
import LoginForm from './LoginForm';

export const metadata = { title: 'Sign in' };

// Server Action — co-located with the page that uses it. The action runs on
// the server, sets the cookie, then redirects.
async function loginAction(prevState, formData) {
  'use server';

  const email = formData.get('email');
  const password = formData.get('password');
  const next = formData.get('next') || '/home';

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  let token;
  try {
    const { data } = await api.login(email, password);
    token = data.token;
  } catch (err) {
    if (err.status === 401) return { error: 'Invalid email or password.' };
    return { error: err.message };
  }

  await setSessionCookie(token);
  redirect(next);
}

export default async function LoginPage({ searchParams }) {
  const { next = '/home' } = await searchParams;
  return <LoginForm action={loginAction} next={next} />;
}
