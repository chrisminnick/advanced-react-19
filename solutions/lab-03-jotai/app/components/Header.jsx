import { useAtomValue, useSetAtom } from 'jotai';
import { themeAtom, toggleThemeAtom, sidebarOpenAtom, openSidebarAtom, closeSidebarAtom } from '../atoms/ui.js';
import { userNameAtom } from '../atoms/user.js';

export default function Header() {
  const userName = useAtomValue(userNameAtom);
  const theme = useAtomValue(themeAtom);
  const toggleTheme = useSetAtom(toggleThemeAtom);
  const sidebarOpen = useAtomValue(sidebarOpenAtom);
  const openSidebar = useSetAtom(openSidebarAtom);
  const closeSidebar = useSetAtom(closeSidebarAtom);

  return (
    <header className="app-header">
      <button
        type="button"
        onClick={() => (sidebarOpen ? closeSidebar() : openSidebar())}
      >
        {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      </button>
      <span>Theme: {theme}</span>
      <button type="button" onClick={() => toggleTheme()}>Toggle theme</button>
      <span className="spacer" />
      <span>Hi, {userName}</span>
    </header>
  );
}
