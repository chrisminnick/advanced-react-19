import { useAppContext } from '../context/AppContext.jsx';

// Notice the prop `user` — it isn't used here, but the parent passes it
// "just in case." That's the prop-drilling smell Lab 3 asks you to remove.
export default function Sidebar({ user }) {
  const { theme, sidebarOpen, closeSidebar, notifications } = useAppContext();

  if (!sidebarOpen) return null;

  return (
    <aside className={`sidebar sidebar-${theme}`}>
      <button type="button" onClick={closeSidebar}>Close</button>
      <h2>Hi, {user?.name ?? 'friend'}</h2>
      <h3>Notifications ({notifications.length})</h3>
      <ul>
        {notifications.length === 0 && <li>No notifications.</li>}
        {notifications.map((n) => (
          <li key={n.id}>{n.text}</li>
        ))}
      </ul>
    </aside>
  );
}
