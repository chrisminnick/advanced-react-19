import { useUIStore } from '../stores/ui.js';
import { useUserStore } from '../stores/user.js';

// No `user` prop. Sidebar reads what it needs.
// (`notifications` is server state — Lab 4 will source it via TanStack Query.
// For Lab 3 we just leave a placeholder so the UI doesn't blank out.)
export default function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);
  const theme = useUIStore((s) => s.theme);
  const userName = useUserStore((s) => s.user?.name ?? 'friend');

  if (!sidebarOpen) return null;

  return (
    <aside className={`sidebar sidebar-${theme}`}>
      <button type="button" onClick={closeSidebar}>Close</button>
      <h2>Hi, {userName}</h2>
      <h3>Notifications</h3>
      <p>(coming in Lab 4 via TanStack Query)</p>
    </aside>
  );
}
