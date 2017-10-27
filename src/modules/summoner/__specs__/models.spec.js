import Bluebird from 'bluebird';
import { Summoners, Matchlists, Champions } from '../models';

describe('Models', () => {
  let connector;
  let models;
  beforeEach(() => {
    connector = {
      get: jest.fn(() => Bluebird.resolve()),
    };
    models = {
      Summoners: new Summoners({ connector }),
      Matchlists: new Matchlists({ connector }),
      Champions: new Champions({ connector }),
    };
  });

  describe('Summoners', () => {
    it('Should get summoner by name', () => {
      const summoner = {
        name: 'Fred Jones',
      };
      connector.get.mockImplementationOnce(() => Bluebird.resolve(summoner));
      return models.Summoners.getSummonerByName(summoner.name)
        .then(r => {
          expect(r).toBe(summoner);
          expect(connector.get).lastCalledWith('/lol/summoner/v3/summoners/by-name/Fred%20Jones');
        });
    });
  });

  describe('Matchlists', () => {
    it('Should get recent by account', () => {
      const accountId = 123;
      const response = {
        matches: [],
      };
      connector.get.mockImplementationOnce(() => Bluebird.resolve(response));
      return models.Matchlists.getRecentByAccount(accountId)
        .then(r => {
          expect(r).toBe(response.matches);
          expect(connector.get).lastCalledWith('/lol/match/v3/matchlists/by-account/123/recent');
        });
    });
  });

  describe('Champions', () => {
    it('Should get by id', () => {
      const championId = 123;
      const response = {
        data: {
          Champion1: {
            id: championId,
            name: 'Champion1',
          },
        },
      };
      connector.get.mockImplementationOnce(() => Bluebird.resolve(response));
      return models.Champions.getById(championId)
        .then(r => {
          expect(r).toBe(response.data.Champion1);
          expect(connector.get).lastCalledWith('/lol/static-data/v3/champions');
        });
    });
  });
});
