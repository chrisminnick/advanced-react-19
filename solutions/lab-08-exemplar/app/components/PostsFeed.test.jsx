// PostsFeed is pure presentation — it takes a posts array and renders it.
// Pure-prop components don't need any providers. Three baseline tests cover
// the interesting branches: empty, populated, and the optimistic
// `sending` flag.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostsFeed from './PostsFeed.jsx';

describe('PostsFeed', () => {
  it('shows the empty state when there are no posts', () => {
    render(<PostsFeed posts={[]} />);
    expect(
      screen.getByText(/no posts yet/i)
    ).toBeInTheDocument();
  });

  it('renders one item per post with title and body', () => {
    const posts = [
      {
        id: '1',
        title: 'Hello',
        body: 'Body of hello',
        author: 'a@b.com',
        createdAt: '2026-05-10T10:00:00Z',
      },
      {
        id: '2',
        title: 'World',
        body: 'Body of world',
        author: 'c@d.com',
        createdAt: '2026-05-10T11:00:00Z',
      },
    ];
    render(<PostsFeed posts={posts} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Hello' })).toBeInTheDocument();
    expect(screen.getByText('Body of hello')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'World' })).toBeInTheDocument();
  });

  it('marks an optimistic post as busy and adds the sending hint', () => {
    const posts = [
      {
        id: 'optimistic-1',
        title: 'Just sent',
        body: 'Should be dim',
        author: '(you)',
        createdAt: '2026-05-10T12:00:00Z',
        sending: true,
      },
    ];
    render(<PostsFeed posts={posts} />);

    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/sending…/)).toBeInTheDocument();
  });
});
