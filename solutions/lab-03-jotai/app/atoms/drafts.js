import { atom } from 'jotai';

// Primitive: the drafts list itself.
export const draftsAtom = atom([]);

// Derived: the count, used by Sidebar's badge. Subscribers re-render only when
// the *length* changes, not on every draft mutation.
export const draftsCountAtom = atom((get) => get(draftsAtom).length);

// Write-only action atoms. Components that dispatch them via useSetAtom don't
// re-render when the underlying drafts atom changes — they only get a setter.
export const addDraftAtom = atom(null, (get, set, draft) => {
  set(draftsAtom, [...get(draftsAtom), draft]);
});

export const removeDraftAtom = atom(null, (get, set, id) => {
  set(
    draftsAtom,
    get(draftsAtom).filter((d) => d.id !== id)
  );
});
