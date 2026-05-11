import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import api from '../api/client.js';

export default function Signup() {
  const { user } = useAuth();
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState('success');

  if (user) return <Navigate to="/chat" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post('/api/signup', {
        email: e.target.email.value,
        password: e.target.password.value,
        displayName: e.target.displayName.value,
      });
      // Look at the *fresh* response data — not at a setState'd value.
      // The legacy starter's `if (this.state.signupMessage === ...)` was
      // a textbook stale-state bug.
      if (res.status === 201) {
        setVariant('success');
        setMessage('User created! Please log in.');
      } else {
        setVariant('warning');
        setMessage(res.data?.message ?? 'Signup unsuccessful');
      }
    } catch (err) {
      setVariant('danger');
      setMessage(err.response?.data?.message ?? 'Signup failed');
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mt-5">
          <div className="card-header">
            <h4>Sign Up</h4>
          </div>
          <div className="card-body">
            {message && (
              <div className={`alert alert-${variant}`} role="alert">
                {message} {variant === 'success' && <Link to="/login">login</Link>}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="displayName">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <input
                  required
                  type="password"
                  id="password"
                  name="password"
                  minLength={8}
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <button className="btn btn-primary">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
