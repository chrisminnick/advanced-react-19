import { atom } from 'jotai';

// Hydrated from the route loader. Per Lab 4, this becomes a Jotai async atom
// (or moves out of Jotai entirely into TanStack Query).
export const userAtom = atom(null);

export const userNameAtom = atom((get) => get(userAtom)?.name ?? 'guest');
export const userEmailAtom = atom((get) => get(userAtom)?.email ?? null);
