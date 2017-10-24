import React from 'react';
import Header from 'common/components/header';

import {
  Jumbotron,
} from 'react-bootstrap';

export default () => (
  <div>
    <Header />
    <div className="container">
      <Jumbotron>
        <h1>Welcome!</h1>
        <p>Use the search field above to find a summoner.</p>
      </Jumbotron>
    </div>
  </div>
);
