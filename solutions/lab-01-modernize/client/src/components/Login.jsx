import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const [error, setError] = useState('');

  if (user) return <Navigate to="/chat" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(e.target.email.value, e.target.password.value);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed');
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mt-5">
          <div className="card-header">
            <h4>Login</h4>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <button className="btn btn-primary">Login</button>
                <Link to="/signup" className="btn m-3">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
