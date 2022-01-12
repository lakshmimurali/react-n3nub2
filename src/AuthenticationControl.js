import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import LoginButton from './Login';

import AddToDo from './App';

const AuthControlComponent = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isAuthenticated === true) {
    return <AddToDo />;
  } else if (isAuthenticated === false) {
    return <LoginButton />;
  }
};

export default AuthControlComponent;
