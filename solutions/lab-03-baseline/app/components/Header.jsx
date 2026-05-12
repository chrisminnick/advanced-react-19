import { useAppContext } from '../context/AppContext.jsx';

// Reads four unrelated values from context. Re-renders on EVERY context change,
// even if it's just `posts` updating somewhere else.
export default function Header() {
  const { user, theme, toggleTheme, sidebarOpen, openSidebar, closeSidebar } =
    useAppContext();

  return (
    <header className="app-header">
      <button
        type="button"
        onClick={() => (sidebarOpen ? closeSidebar() : openSidebar())}
      >
        {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      </button>
      <span>Theme: {theme}</span>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
      <span className="spacer" />
      <span>Hi, {user?.name ?? 'guest'}</span>
    </header>
  );
}
