import { useUIStore } from '../stores/ui.js';
import { useUser } from '../hooks/useUser.js';

export default function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);
  const theme = useUIStore((s) => s.theme);
  const { user } = useUser();
  const userName = user?.name ?? 'friend';

  if (!sidebarOpen) return null;

  return (
    <aside className={`sidebar sidebar-${theme}`}>
      <button type="button" onClick={closeSidebar}>Close</button>
      <h2>Hi, {userName}</h2>
      <h3>Notifications</h3>
      <p>(would be a useQuery once we add /api/notifications)</p>
    </aside>
  );
}
