import { useUIStore } from '../stores/ui.js';
import { useUser } from '../hooks/useUser.js';

export default function Header() {
  const { user } = useUser();
  const userName = user?.name ?? 'guest';

  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const openSidebar = useUIStore((s) => s.openSidebar);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  return (
    <header className="app-header">
      <button
        type="button"
        onClick={() => (sidebarOpen ? closeSidebar() : openSidebar())}
      >
        {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      </button>
      <span>Theme: {theme}</span>
      <button type="button" onClick={toggleTheme}>Toggle theme</button>
      <span className="spacer" />
      <span>Hi, {userName}</span>
    </header>
  );
}
