import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import LoginButton from './Login';

import AddToDo from './App';
import DetailsPage from './ToDoDetail';

const AuthControlComponent = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isAuthenticated === true) {
    return (
      <Switch>
        <Route exact path="/">
          <AddToDo />
        </Route>
        <Route path="/todo/detail/:id">
          <DetailsPage />
        </Route>
      </Switch>
    );
  } else if (isAuthenticated === false) {
    return <LoginButton />;
  }
};

export default AuthControlComponent;
