import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Drafts store. Action names describe transitions, not setters.
export const useDraftsStore = create(
  devtools(
    (set) => ({
      items: [],
      addDraft: (draft) =>
        set((s) => ({ items: [...s.items, draft] }), false, 'drafts/add'),
      removeDraft: (id) =>
        set(
          (s) => ({ items: s.items.filter((d) => d.id !== id) }),
          false,
          'drafts/remove'
        ),
      clear: () => set({ items: [] }, false, 'drafts/clear'),
    }),
    { name: 'drafts' }
  )
);
