import React from 'react';

// Routing via React Router
import {
  Route,
  Switch,
} from 'react-router-dom';

import { Redirect } from 'kit/lib/routing';

import Home from 'modules/landing/landing';
import Summoner from 'modules/summonor/summonor';

export default () =>
  (
    <Switch>
      <Redirect exact from="/" to="/EUW" />
      <Route path="/:region" component={Home} />
      <Route path="/:region/summoner/:summoner" component={Summoner} />
      <Route component={() => (<p>Not found</p>)} />
    </Switch>
  );
