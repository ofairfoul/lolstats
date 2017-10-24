import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import {
  PageHeader,
} from 'react-bootstrap';

import Header from 'common/components/header';

const enhancer = compose(
  withRouter,
  withProps(({ match: { params: { summoner } } }) => ({ summoner })),
);

export default enhancer(({ summoner }) => (
  <div>
    <Header />
    <div className="container">
      <PageHeader>
        { summoner }
      </PageHeader>
    </div>
  </div>
));
