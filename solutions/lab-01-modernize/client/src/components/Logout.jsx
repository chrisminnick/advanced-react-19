import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Logout() {
  const { logout, token } = useAuth();

  // Synchronization with an external system (the auth backend), so a useEffect
  // is the right tool here. Runs once on mount.
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) return <Navigate to="/login" replace />;
  return <p className="mt-5">Signing you out…</p>;
}
