import { useDispatch, useSelector } from 'react-redux';
import { closeSidebar } from '../store/uiSlice.js';
import { selectUserName } from '../store/userSlice.js';

export default function Sidebar() {
  const open = useSelector((s) => s.ui.sidebarOpen);
  const theme = useSelector((s) => s.ui.theme);
  const userName = useSelector(selectUserName);
  const draftsCount = useSelector((s) => s.drafts.items.length);
  const dispatch = useDispatch();

  if (!open) return null;
  return (
    <aside className={`sidebar sidebar-${theme}`}>
      <button type="button" onClick={() => dispatch(closeSidebar())}>Close</button>
      <h2>Hi, {userName}</h2>
      <p>You have {draftsCount} unsaved {draftsCount === 1 ? 'draft' : 'drafts'}.</p>
      <h3>Notifications</h3>
      <p>(coming in Lab 4 via RTK Query)</p>
    </aside>
  );
}
