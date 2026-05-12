import { Provider } from 'react-redux';
import { store } from '../store/index.js';

// Wraps a route subtree with the Redux Provider. Kept as its own component
// so the route file stays declarative.
export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
