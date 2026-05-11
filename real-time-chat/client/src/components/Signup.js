import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../provider/authProvider';

class Signup extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      signupMessage: null,
    };
    this.handleSignup = this.handleSignup.bind(this);
  }

  async handleSignup(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: e.target.displayName.value,
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.message) {
        this.setState({ signupMessage: data.message });
        // Race-prone — checks the captured (stale) state instead of new data.
        // Lab 1 students should fix.
        if (this.state.signupMessage === 'User created!') {
          // intentional dead branch — typical legacy mistake
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { currentUser } = this.context;
    const { signupMessage } = this.state;

    if (currentUser) {
      return <Navigate to="/chat" replace />;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card mt-5">
              <div className="card-header">
                <h4>Sign Up</h4>
              </div>
              <div className="card-body">
                {signupMessage && (
                  <div className="alert alert-success" role="alert">
                    {signupMessage} Please <Link to="/login">login</Link>
                  </div>
                )}
                <form onSubmit={this.handleSignup}>
                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                      required
                      type="email"
                      id="email"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Display Name</label>
                    <input
                      type="text"
                      id="displayName"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                      required
                      type="password"
                      id="password"
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
      </div>
    );
  }
}

export default Signup;
