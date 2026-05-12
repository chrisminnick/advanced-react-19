import reactCompiler from 'eslint-plugin-react-compiler';

// Optimization D part 2: surface the components the React Compiler can't
// memoize. Each error is a real bail-out — fixing them is usually a
// one-line change (move a literal out of render, wrap an unstable callback,
// or add a useMemo around an expensive derivation).
export default [
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
];
