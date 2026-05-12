import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, openSidebar, closeSidebar } from '../store/uiSlice.js';
import { selectUserName } from '../store/userSlice.js';

export default function Header() {
  const userName = useSelector(selectUserName);
  const theme = useSelector((s) => s.ui.theme);
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const dispatch = useDispatch();

  return (
    <header className="app-header">
      <button
        type="button"
        onClick={() => dispatch(sidebarOpen ? closeSidebar() : openSidebar())}
      >
        {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      </button>
      <span>Theme: {theme}</span>
      <button type="button" onClick={() => dispatch(toggleTheme())}>
        Toggle theme
      </button>
      <span className="spacer" />
      <span>Hi, {userName}</span>
    </header>
  );
}
