import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../provider/authProvider';

class Logout extends React.Component {
  static contextType = AuthContext;

  // Side effect in componentDidMount — typical legacy pattern.
  // Lab 1 students should reconsider where this should live.
  componentDidMount() {
    this.context.setAuth();
  }

  render() {
    return <Navigate to="/" replace />;
  }
}

export default Logout;
