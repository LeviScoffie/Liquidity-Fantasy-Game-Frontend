import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import LoginDedicated from '../Pages/Standalone/LoginDedicated'
import Application from './Application';
import ThemeWrapper from './ThemeWrapper';
import { Login, Portfolio, Register } from '../pageListAsync';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

function App(props) {
  const { history } = props;
  return (
    <ThemeWrapper>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={LoginDedicated} />
          <Route path="/app" component={Application} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    </ThemeWrapper>
  );
}

App.propTypes = {
  history: PropTypes.object.isRequired,
};

export default App;
