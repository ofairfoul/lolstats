import { get, chain } from 'lodash';

export class Summoners {
  constructor({ connector }) {
    this.connector = connector;
  }

  getSummonerByName(summonerName) {
    return this.connector.get(`/lol/summoner/v3/summoners/by-name/${summonerName}`);
  }
}

export class Matchlists {
  constructor({ connector }) {
    this.connector = connector;
  }

  getRecentByAccount(accountId) {
    return this.connector.get(`/lol/match/v3/matchlists/by-account/${accountId}/recent`)
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
