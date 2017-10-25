import React from 'react';

// Routing via React Router
import {
  Route,
  Switch,
} from 'react-router-dom';

import { Redirect } from 'kit/lib/routing';

import Landing from 'modules/landing/components/landing';
import Summoner from 'modules/summoner/components/summoner';

export default () =>
  (
    <Switch>
      <Redirect exact from="/" to="/NA" />
      <Route path="/:region/summoner/:summoner" component={Summoner} />
      <Route path="/:region" component={Landing} />
      <Route component={() => (<p>Not found</p>)} />
    </Switch>
  );
