import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../provider/authProvider.js';

class Login extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      loginErr: '',
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  async handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.message) {
        this.setState({ loginErr: data.message });
      } else {
        this.context.setAuth({
          token: data.accessToken,
          uid: data.userId,
          displayName: data.displayName,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { currentUser } = this.context;
    const { loginErr } = this.state;

    // Auth-redirect via Navigate component (declarative — no useNavigate hook).
    if (currentUser) {
      return <Navigate to="/chat" replace />;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card mt-5">
              <div className="card-header">
                <h4>Login</h4>
              </div>
              <div className="card-body">
                {loginErr && (
                  <div className="alert alert-danger" role="alert">
                    {loginErr}
                  </div>
                )}
                <form onSubmit={this.handleLogin}>
                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input type="email" id="email" className="form-control" />
                  </div>
                  <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                      type="password"
                      id="password"
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
      </div>
    );
  }
}

export default Login;
