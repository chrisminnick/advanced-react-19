# Lab 2 — Solution Exemplar

This document sketches the reference solutions for both branches. Use it when checking student submissions or when seeding `solution/lab-02-rr-v7` and `solution/lab-02-nextjs`.

It is not a complete file-by-file dump — it shows the patterns and the key files for each framework.

---

## Solution A — `solution/lab-02-rr-v7`

### Project structure

```
social-media-rr-v7/
├── package.json              ← React 19, RR v7, Vite
├── vite.config.js
├── react-router.config.ts
└── app/
    ├── routes.ts             ← route configuration
    ├── root.jsx              ← app shell
    ├── lib/
    │   ├── api.server.ts     ← server-only backend client
    │   └── session.server.ts ← cookie helpers
    └── routes/
        ├── _index.jsx        ← /
        ├── login.jsx
        ├── signup.jsx
        ├── logout.jsx
        └── home.jsx          ← protected route
```

### Key file: `app/routes.ts`

```ts
import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
  index('routes/_index.jsx'),
  route('login', 'routes/login.jsx'),
  route('signup', 'routes/signup.jsx'),
  route('logout', 'routes/logout.jsx'),
  route('home', 'routes/home.jsx'),
] satisfies RouteConfig;
```

(Plain JS works too if you prefer; the lab is JS-first.)

### Key file: `app/lib/session.server.ts`

```js
import { createCookieSessionStorage } from '@react-router/node';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET ?? 'dev-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function getSession(request) {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

export async function commitSession(session) {
  return sessionStorage.commitSession(session);
}

export async function destroySession(session) {
  return sessionStorage.destroySession(session);
}
```

### Key file: `app/routes/login.jsx`

```jsx
import { Form, redirect, useActionData } from 'react-router';
import { commitSession, getSession } from '../lib/session.server';
import * as api from '../lib/api.server';

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const { token } = await api.login(email, password);
    const session = await getSession(request);
    session.set('token', token);
    return redirect('/home', {
      headers: { 'Set-Cookie': await commitSession(session) },
    });
  } catch (err) {
    return { error: err.message };
  }
}

export default function LoginPage() {
  const actionData = useActionData();
  return (
    <Form method="post">
      <h1>Sign in</h1>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {actionData?.error && <p className="error">{actionData.error}</p>}
      <button type="submit">Sign in</button>
    </Form>
  );
}
```

### Key file: `app/routes/home.jsx`

```jsx
import { redirect, useLoaderData } from 'react-router';
import { getSession } from '../lib/session.server';
import * as api from '../lib/api.server';

export async function loader({ request }) {
  const session = await getSession(request);
  const token = session.get('token');
  if (!token) {
    throw redirect(`/login?next=${encodeURIComponent(new URL(request.url).pathname)}`);
  }
  const posts = await api.listPosts(token);
  return { posts };
}

export default function HomePage() {
  const { posts } = useLoaderData();
  return (
    <main>
      <h1>Recent posts</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

### Key file: `app/routes/logout.jsx`

```jsx
import { Form, redirect } from 'react-router';
import { destroySession, getSession } from '../lib/session.server';

export async function action({ request }) {
  const session = await getSession(request);
  return redirect('/login', {
    headers: { 'Set-Cookie': await destroySession(session) },
  });
}

export default function LogoutPage() {
  return (
    <Form method="post">
      <button type="submit">Sign out</button>
    </Form>
  );
}
```

---

## Solution B — `solution/lab-02-nextjs`

### Project structure

```
social-media-nextjs/
├── package.json              ← React 19, Next.js 15
├── next.config.mjs
├── middleware.js             ← auth gate
└── app/
    ├── layout.jsx            ← root layout
    ├── page.jsx              ← /
    ├── (auth)/
    │   ├── login/page.jsx
    │   └── signup/page.jsx
    ├── home/page.jsx         ← protected
    ├── logout/route.js       ← POST handler
    └── lib/
        ├── api.js            ← backend client
        └── session.js        ← cookie helpers
```

### Key file: `middleware.js`

```js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('session');
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/home/:path*'],
};
```

### Key file: `app/(auth)/login/page.jsx`

```jsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { login } from '@/app/lib/api';

async function loginAction(formData) {
  'use server';
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const { token } = await login(email, password);
    cookies().set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });
  } catch (err) {
    return { error: err.message };
  }
  redirect('/home');
}

export default function LoginPage() {
  return (
    <form action={loginAction}>
      <h1>Sign in</h1>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign in</button>
    </form>
  );
}
```

(For the error display, students can convert this to use `useActionState` — covered in Module 2.)

### Key file: `app/home/page.jsx`

```jsx
import { cookies } from 'next/headers';
import { listPosts } from '@/app/lib/api';

export default async function HomePage() {
  const token = cookies().get('session')?.value;
  const posts = await listPosts(token);

  return (
    <main>
      <h1>Recent posts</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

The middleware ensures `token` exists by the time this component renders.

### Key file: `app/logout/route.js`

```js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  cookies().delete('session');
  const url = new URL('/login', request.url);
  return NextResponse.redirect(url, { status: 303 });
}
```

A "Sign out" form on any page can post here:

```jsx
<form action="/logout" method="post">
  <button type="submit">Sign out</button>
</form>
```

---

## Reference reflection — what students should produce

The students' `lab02-reflection.md` should be roughly three paragraphs, each citing specifics. Use this as a benchmark.

```markdown
# Lab 2 reflection

## Which framework felt more natural?

React Router v7 felt slightly more natural for this app, mostly because the loader/action exports made it obvious where each piece of code runs. In `home.jsx`, the loader is right next to the component, and the protected-route logic lives in the same file. In Next.js, the auth check is in `middleware.js`, the page is in `app/home/page.jsx`, and they're connected by a matcher config. That separation is cleaner for app-wide auth but makes per-route reasoning harder.

## Where did the two diverge structurally?

The biggest divergence was where authentication lives. RR v7 put it inside each protected route's loader; Next.js put it in middleware that runs before any page code. The other notable difference: in RR v7 I had to opt in to React Router's `<Form>` to get the action wiring, while in Next.js the regular HTML `<form action={fn}>` just worked because of the `'use server'` directive. Both got me to a similar end state, but the path was noticeably different.

## Which would I advocate for tomorrow?

Probably Next.js, mostly for ecosystem reasons — most of our team has more Next.js experience and there are more examples online. But if I were starting a project that needed to deploy to a non-Vercel host with strong control over runtime behavior, RR v7 framework mode would be a strong second choice. The tie-breaker would be deploy story, not the framework's raw capabilities.
```
