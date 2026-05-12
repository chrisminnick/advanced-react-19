// Intentionally throws so the nearest error.js can catch it.
// Useful for showing students the error-boundary lifecycle: page renders
// a fallback, the user clicks "Try again" → reset() → page tries to
// render again → throws again → fallback renders again.
export default function Oops() {
  throw new Error('This page deliberately throws — try the error.js boundary.');
}
