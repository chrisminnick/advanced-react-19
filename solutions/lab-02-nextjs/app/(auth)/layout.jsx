// Shared layout for the (auth) route group. The route group itself ((auth))
// doesn't show up in URLs — it just lets us share UI between /login and
// /signup without nesting them under /auth/*.
export default function AuthLayout({ children }) {
  return <div className="auth-shell">{children}</div>;
}
