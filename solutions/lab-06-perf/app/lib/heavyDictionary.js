// Stand-in for a "heavy" dependency. Real Lab 6 instructors can swap this
// for `@uiw/react-md-editor` (78KB) — the optimization pattern is identical.
//
// We export a 100-entry dictionary so the file is meaningfully larger than
// the rest of the home-page bundle without pulling in a real dep.
export const SUGGESTED_TAGS = Array.from({ length: 100 }, (_, i) => ({
  tag: `t${String(i).padStart(3, '0')}`,
  weight: Math.sin(i) * 100,
  examples: [
    `Example A for tag t${i}: lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Example B for tag t${i}: sed do eiusmod tempor incididunt ut labore et dolore magna.`,
    `Example C for tag t${i}: ut enim ad minim veniam, quis nostrud exercitation ullamco.`,
    `Example D for tag t${i}: duis aute irure dolor in reprehenderit in voluptate velit.`,
  ],
  category: ['ui', 'data', 'auth', 'perf', 'testing'][i % 5],
}));

export function pickSuggestion(seed) {
  return SUGGESTED_TAGS[Math.abs(seed.length) % SUGGESTED_TAGS.length];
}
