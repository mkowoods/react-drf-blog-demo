import {Route, Redirect} from 'react-router-dom';
import React from 'react'




//example taken from https://reacttraining.com/react-router/web/example/auth-workflow
const PrivateRoute = ({store, component: Component, ...rest }) => {
    const state = store.getState();
    return(
      <Route
        {...rest}
        render={props =>
          state.isAuthenticated ? (<Component {...props} />) : (
              window.location.replace("/login/")
          )
        }
      />

    )
};

export default PrivateRoute;