import React, { useEffect } from "react";
import { SecureRoute, LoginCallback } from "@okta/okta-react";
import { Route, Switch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useOktaAuth } from "@okta/okta-react";

import { initializeUser } from "./actions/userActions";

import Landing from "./components/Landing";
import LoginOkta from "./components/auth/LoginOkta";
import ConnectAccounts from "./components/auth/ConnectAccounts";
import Home from "./components/Home";

import "./sass/index.scss";

function App(props) {
  const { authService } = useOktaAuth();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    console.log("App.js useEffect fired", Date.now());
    if (!user.initialized) {
      dispatch(initializeUser(authService));
    } else if (!user.twitter_handle) {
      history.push("/connect/twitter");
    }
  }, [user]);

  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route
        exact
        path="/login"
        render={(props) => (
          <LoginOkta {...props} baseUrl={process.env.REACT_APP_OKTA_DOMAIN} />
        )}
      />
      <SecureRoute path="/home" component={Home} />
      <SecureRoute path="/connect" component={ConnectAccounts} />
      <Route path="/implicit/callback" component={LoginCallback} />
    </Switch>
  );
}

export default App;
