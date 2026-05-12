import { useUIStore } from '../stores/ui.js';
import { useUserStore } from '../stores/user.js';

// Three slim selectors instead of one bloated context read. This component
// re-renders when (a) the user changes, (b) the theme changes, or (c) the
// sidebar opens/closes — never for unrelated state like drafts.
export default function Header() {
  const userName = useUserStore((s) => s.user?.name ?? 'guest');
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
