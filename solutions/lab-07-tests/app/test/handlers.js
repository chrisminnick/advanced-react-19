import { http, HttpResponse } from 'msw';

// Default handlers. Match what the real backend returns so the production
// code paths exercise the same data shapes.
//
// The auth handlers honor a couple of magic passwords so tests can ask for
// specific failure modes without juggling server.use() everywhere:
//   - 'wrong'  → 401 invalid credentials
//   - 'boom'   → 500 server error

const POSTS = [
  {
    id: '1',
    title: 'First post',
    body: 'Hello world',
    author: 'marisol@example.com',
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Second post',
    body: 'Lab 7 in progress',
    author: 'diego@example.com',
    createdAt: '2026-05-10T11:00:00Z',
  },
];

export const handlers = [
  http.get('/api/me', () =>
    HttpResponse.json({ id: '1', email: 'test@example.com', name: 'Test User' })
  ),

  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    if (password === 'wrong') {
      return HttpResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }
    if (password === 'boom') {
      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    }
    return HttpResponse.json({
      accessToken: 'fake-token',
      userId: '1',
      displayName: 'Test User',
      token: 'fake-token',
      user: { id: '1', email, name: 'Test User' },
    });
  }),

  http.post('/api/logout', () =>
    HttpResponse.json({ message: 'User logged out' })
  ),

  http.get('/api/posts', () => HttpResponse.json(POSTS)),

  http.post('/api/posts', async ({ request }) => {
    const body = await request.json();
    if (body.body === 'boom') {
      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    }
    return HttpResponse.json(
      {
        id: '99',
        title: body.title ?? '',
        body: body.body,
        author: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),
];
