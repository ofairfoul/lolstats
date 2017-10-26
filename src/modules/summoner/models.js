import { get, chain } from 'lodash';
import buildPath from 'common/util/buildPath';

export class Summoners {
  constructor({ connector }) {
    this.connector = connector;
  }

  getSummonerByName(summonerName) {
    const path = buildPath(
      '/lol/summoner/v3/summoners/by-name/:summonerName',
      { summonerName },
    );
    return this.connector.get(path);
  }
}

export class Matchlists {
  constructor({ connector }) {
    this.connector = connector;
  }

  getRecentByAccount(accountId) {
    const path = buildPath(
      '/lol/match/v3/matchlists/by-account/:accountId/recent',
      { accountId },
    );
    return this.connector.get(path)
      .then(ml => get(ml, 'matches', []));
  }
}

export class Champions {
  constructor({ connector }) {
    this.connector = connector;
  }

  getById(id) {
    return this.connector.get('/lol/static-data/v3/champions')
      .then(({ data }) => chain(data).values().find({ id }).value());
  }
}
