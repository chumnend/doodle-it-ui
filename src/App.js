import { useState, useEffect, useCallback } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Nav from './components/Nav';
import Designer from './containers/Designer';
import Home from './containers/Home';
import Register from './containers/Register';
import Landing from './containers/Landing';
import Login from './containers/Login';
import NotFound from './containers/NotFound';
import * as actions from './store/actions';

const App = () => {
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const validateUser = useCallback(
    () => dispatch(actions.authRequestValidate()),
    [dispatch],
  );

  const logoutUser = useCallback(() => dispatch(actions.authLogoutRequest()), [
    dispatch,
  ]);

  useEffect(() => {
    validateUser();
    setLoading(false);
  }, [validateUser]);

  return (
    <>
      <Nav isLoggedIn={!!auth.token} logout={logoutUser} />
      {!loading && (
        <Switch>
          <Route
            exact
            path="/home"
            render={(props) =>
              !!auth.token ? <Home {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/design/:id?"
            render={(props) =>
              !!auth.token ? <Designer {...props} /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/register"
            render={(props) =>
              !auth.token ? <Register {...props} /> : <Redirect to="/console" />
            }
          />
          <Route
            exact
            path="/login"
            render={(props) =>
              !auth.token ? <Login {...props} /> : <Redirect to="/console" />
            }
          />
          <Route
            exact
            path="/"
            render={(props) =>
              !auth.token ? <Landing {...props} /> : <Redirect to="/console" />
            }
          />
          <Route component={NotFound} />
        </Switch>
      )}
    </>
  );
};

export default App;
