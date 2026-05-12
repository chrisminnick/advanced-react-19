import { useAtomValue, useSetAtom } from 'jotai';
import { sidebarOpenAtom, closeSidebarAtom, themeAtom } from '../atoms/ui.js';
import { userNameAtom } from '../atoms/user.js';
import { draftsCountAtom } from '../atoms/drafts.js';

export default function Sidebar() {
  const open = useAtomValue(sidebarOpenAtom);
  const close = useSetAtom(closeSidebarAtom);
  const theme = useAtomValue(themeAtom);
  const userName = useAtomValue(userNameAtom);
  // Note we read the *count*, not the array — this badge re-renders only on
  // count changes. The drafts list itself is read by PostComposer.
  const draftsCount = useAtomValue(draftsCountAtom);

  if (!open) return null;
  return (
    <aside className={`sidebar sidebar-${theme}`}>
      <button type="button" onClick={() => close()}>Close</button>
      <h2>Hi, {userName}</h2>
      <p>You have {draftsCount} unsaved {draftsCount === 1 ? 'draft' : 'drafts'}.</p>
      <h3>Notifications</h3>
      <p>(coming in Lab 4 via TanStack Query)</p>
    </aside>
  );
}
