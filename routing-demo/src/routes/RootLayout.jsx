import { NavLink, Outlet, useNavigation } from 'react-router';

// useNavigation is the v7 pending-UI hook. It returns 'idle', 'loading',
// or 'submitting'. We use it to render a top-of-page progress bar while
// loaders run — that's the canonical pattern for "skeleton-less" pending UI.
export default function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== 'idle';

  return (
    <div className="shell">
      <header>
        <h1>RR v7 routing demo</h1>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/products">Products</NavLink>
        </nav>
        {isNavigating && (
          <div className="progress" aria-label="Loading next page" />
        )}
      </header>
      <main>
        {/* Child routes render here. */}
        <Outlet />
      </main>
      <footer>
        <small>navigation.state: <code>{navigation.state}</code></small>
      </footer>
    </div>
  );
}
