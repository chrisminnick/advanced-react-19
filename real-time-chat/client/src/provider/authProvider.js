import React, { createContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    const stored = JSON.parse(localStorage.getItem('currentUser'));
    this.state = {
      currentUser: stored,
    };
    this.setAuth = this.setAuth.bind(this);
  }

  componentDidMount() {
    this.syncAxiosAndStorage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentUser !== this.state.currentUser) {
      this.syncAxiosAndStorage();
    }
  }

  syncAxiosAndStorage() {
    const { currentUser } = this.state;
    if (currentUser) {
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + currentUser.token;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      console.log('currentUser', currentUser);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('currentUser');
    }
  }

  setAuth(newAuth) {
    this.setState({ currentUser: newAuth });
    console.log('currentUser', this.state.currentUser);
  }

  render() {
    const contextValue = {
      currentUser: this.state.currentUser,
      setAuth: this.setAuth,
    };
    return (
      <AuthContext.Provider value={contextValue}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

// Bridge hook so the existing function-component callsites keep working
// while students are mid-modernization. Lab 1 has students unify on hooks
// across the whole codebase; this is just so the starter app runs.
export function useAuth() {
  return React.useContext(AuthContext);
}

export default AuthProvider;
