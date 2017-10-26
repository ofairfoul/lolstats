import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import Helmet from 'react-helmet';

import {
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

import summonerQuery from '../graphql/summoner.gql';

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

const Error = ({ refetch }) => (
  <Alert bsStyle="danger">
    <h4>Error loading summoner!</h4>
    <p>
      <Button bsStyle="danger" onClick={refetch}>Try again</Button>
    </p>
  </Alert>
);

const Loading = () => (
  <div className="text-center">
    <p>
      <FontAwesome name="circle-o-notch" spin size="3x" />
    </p>
    <p>
      Loading
    </p>
  </div>
);

const SummonerNotFound = ({ summonerName, region }) => (
  <Alert bsStyle="info">
    <h4>Unable to find summoner!</h4>
    <p>
      The summoner with the name
      <b>{summonerName}</b>
      was not found in the
      <b>{region}</b>
      region.
    </p>
    <p>You can try changing region in the menu to search again.</p>
  </Alert>
);

const Summary = ({ summoner }) => (
  <Grid>
    <Helmet title={`LOLStats - ${summoner.name}`} />
    <Row className={css.summary}>
      <Col xs={4} sm={3} lg={2}>
        <Image thumbnail src={summoner.profileIcon} />
      </Col>
      <Col xs={8} sm={9} lg={10}>
        <h2>{summoner.name}</h2>
        <p>Level: <Badge>{summoner.summonerLevel}</Badge></p>
      </Col>
    </Row>
  </Grid>
);

const Match = ({ match }) => (
  <Row key={match.timestamp} className={css.match}>
    <Col xs={3} sm={2} lg={1}>
      <Image thumbnail src={match.champion.championIcon} />
    </Col>
    <Col xs={9} sm={10} lg={11}>
      <h4>
        {match.champion.name} <small className="text-muted">{match.champion.title}</small>
      </h4>
      <p>
        {moment(match.timestamp).fromNow()}
      </p>
    </Col>
  </Row>
);

const MatchList = ({ recentMatchlists }) => (
  <Grid>
    <Row>
      <Col xs={12}><h3>Recent Matches</h3></Col>
    </Row>
    { recentMatchlists && recentMatchlists.map(match => (
      <Match match={match} />
    ))}
  </Grid>
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
      <Helmet title="LOLStats - Summoners" />
      <Header />
      <div className="container">
        {(() => {
          if (error) {
            return (<Error refetch={refetch} />);
          }
          if (loading) {
            return (<Loading />);
          }
          if (!summoner) {
            return (<SummonerNotFound summonerName={summonerName} region={region} />);
          }
          return (
            <div>
              <Summary summoner={summoner} />
              <MatchList recentMatchlists={summoner.recentMatchlists} />
            </div>
          );
        })()}
      </div>
    </div>
  );
});
