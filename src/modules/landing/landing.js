import React from 'react';
import Header from 'common/components/header';
import Helmet from 'react-helmet';

import {
  Jumbotron,
} from 'react-bootstrap';

export default () => (
  <div>
    <Helmet title="LOLStats" />
    <Header />
    <div className="container">
      <Jumbotron>
        <h1>Welcome!</h1>
        <p>Use the search in the menu to find a summoner.</p>
      </Jumbotron>
    </div>
  </div>
);
