import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import {
  PageHeader,
  Alert,
  Button,
  Grid,
  Row,
  Col,
  Image,
  Badge,
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { get } from 'lodash';
import moment from 'moment';

import Header from 'common/components/header';

import summonerQuery from './graphql/summoner.gql';

import css from './summoner.less';

const enhancer = compose(
  withRouter,
  withProps(({ match: { params: { summoner: summonerName, region } } }) =>
    ({ summonerName, region })),
  graphql(summonerQuery, {
    options: ({ summonerName, region }) => ({
      variables: { summonerName, region },
    }),
    props: ({ data: { error, loading, refetch, region } }) => ({
      error,
      loading,
      refetch,
      summoner: get(region, 'summonerByName'),
    }),
  }),
);

export default enhancer(props => {
  const {
    error,
    loading,
    summoner,
    refetch,
    summonerName,
    region,
  } = props;

  return (
    <div>
      <Header />
      <div className="container">
        {(() => {
          if (error) {
            return (
              <Alert bsStyle="danger">
                <h4>Error loading summoner!</h4>
                <p>
                  <Button bsStyle="danger" onClick={refetch}>Try again</Button>
                </p>
              </Alert>
            );
          }
          if (loading) {
            return (
              <div className="text-center">
                <p>
                  <FontAwesome name="circle-o-notch" spin size="3x" />
                </p>
                <p>
                  Loading
                </p>
              </div>
            );
          }
          if (!summoner) {
            return (
              <Alert bsStyle="info">
                <h4>Unable to find summoner!</h4>
                <p>The summoner with the name <b>{summonerName}</b> was not found in the <b>{region}</b> region.</p>
                <p>You can try changing region in the menu to search again.</p>
              </Alert>
            );
          }
          return (
            <Grid>
              <Row className={css.summary}>
                <Col xs={4} sm={3} lg={2}>
                  <Image thumbnail src={summoner.profileIcon} />
                </Col>
                <Col xs={8} sm={9} lg={10}>
                  <h2>{summoner.name}</h2>
                  <p>Level: <Badge>{summoner.summonerLevel}</Badge></p>
                </Col>
              </Row>
              <Row>
                <Col xs={12}><h3>Recent Matches</h3></Col>
              </Row>
              { summoner.recentMatchlists && summoner.recentMatchlists.map(m => (
                <Row key={m.timestamp} className={css.match}>
                  <Col xs={3} sm={2} lg={1}>
                    <Image thumbnail src={m.champion.championIcon} />
                  </Col>
                  <Col xs={9} sm={10} lg={11}>
                    <h4>
                      {m.champion.name} <small className="text-muted">{m.champion.title}</small>
                    </h4>
                    <p>
                      {moment(m.timestamp).fromNow()}
                    </p>
                  </Col>
                </Row>
              ))}
            </Grid>
          );
        })()}
      </div>
    </div>
  );
});
