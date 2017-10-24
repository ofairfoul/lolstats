import React from 'react';

// Routing via React Router
import {
  Route,
  Switch,
} from 'react-router-dom';

import Home from 'modules/landing/landing';

export default () =>
  (
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  );
