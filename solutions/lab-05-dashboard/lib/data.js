import 'server-only';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// In-memory state. Resets when the dev server restarts.
let tasks = [
  { id: 1, title: 'Design boundary diagram', status: 'in-progress' },
  { id: 2, title: 'Wire up dashboard route', status: 'open' },
  { id: 3, title: 'Ship monthly report', status: 'done' },
  { id: 4, title: 'Review AI-generated tests', status: 'in-progress' },
  { id: 5, title: 'Profile the social-media feed', status: 'open' },
  { id: 6, title: 'Migrate auth to HttpOnly cookies', status: 'done' },
  { id: 7, title: 'Update AGENTS.md for the new repo', status: 'open' },
  { id: 8, title: 'Add useOptimistic to chat send', status: 'done' },
  { id: 9, title: 'Spike: TanStack Router type safety', status: 'open' },
];

let activity = [
  { id: 1, actor: 'Marisol', verb: 'commented on', target: 'Boundary diagram', timeAgo: '2m ago' },
  { id: 2, actor: 'Diego', verb: 'closed', target: 'Ship monthly report', timeAgo: '14m ago' },
  { id: 3, actor: 'Priya', verb: 'opened', target: 'Profile the feed', timeAgo: '1h ago' },
  { id: 4, actor: 'Sam', verb: 'reviewed', target: 'AI test suite', timeAgo: '2h ago' },
  { id: 5, actor: 'Marisol', verb: 'pushed to', target: 'lab-repo upgrade', timeAgo: '3h ago' },
  { id: 6, actor: 'Diego', verb: 'merged', target: 'AGENTS.md update', timeAgo: 'yesterday' },
  { id: 7, actor: 'Priya', verb: 'deployed', target: 'social-media v2.0', timeAgo: 'yesterday' },
  { id: 8, actor: 'Sam', verb: 'paged', target: 'on the broken middleware', timeAgo: '2 days ago' },
  { id: 9, actor: 'Marisol', verb: 'shipped', target: 'optimistic chat sends', timeAgo: '3 days ago' },
  { id: 10, actor: 'Diego', verb: 'closed', target: 'tracking issue #42', timeAgo: '4 days ago' },
];

const team = [
  { id: 1, name: 'Marisol Reyes', role: 'PM', avatar: '/avatars/marisol.png' },
  { id: 2, name: 'Diego Cabrera', role: 'Eng Lead', avatar: '/avatars/diego.png' },
  { id: 3, name: 'Priya Shah', role: 'Senior Engineer', avatar: '/avatars/priya.png' },
  { id: 4, name: 'Sam Okafor', role: 'Engineer', avatar: '/avatars/sam.png' },
  { id: 5, name: 'Yuki Tanaka', role: 'Designer', avatar: '/avatars/yuki.png' },
];

// Public API — async with deliberate delays so streaming demo produces visible benefit.

export async function getTaskCounts() {
  await sleep(150); // fast — this is the lead card; it should land first when streaming
  return {
    open: tasks.filter((t) => t.status === 'open').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };
}

export async function getRecentActivity() {
  await sleep(800); // slow — pairs with a Suspense boundary in the stretch task
  return [...activity];
}

export async function getTeamMembers() {
  await sleep(400);
  return [...team];
}

export async function getTasks() {
  await sleep(150);
  return [...tasks];
}

export async function createTask({ title, status }) {
  await sleep(200);
  const task = { id: tasks.length + 1, title, status };
  tasks = [task, ...tasks];
  activity = [
    { id: activity.length + 1, actor: 'You', verb: 'created', target: title, timeAgo: 'just now' },
    ...activity,
  ];
  return task;
}
