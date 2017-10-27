import { last } from 'lodash';
import Bluebird from 'bluebird';
import LolConnector from '../lolConnector';

describe('Connectors', () => {
  describe('LolConnector', () => {
    let connector;
    let rp;
    beforeEach(() => {
      rp = jest.fn(() => Bluebird.resolve());
      connector = new LolConnector({ region: 'NA', requestPromise: rp });
    });

    it('Happy path', () => {
      const result = { };
      rp.mockImplementationOnce(() => Bluebird.resolve(result));
      return connector.get('/path/to/resource')
        .then(r => {
          expect(r).toBe(result);
          expect(last(rp.mock.calls)).toEqual([{
            headers: {
              'X-Riot-Token': undefined,
            },
            json: true,
            uri: 'https://na1.api.riotgames.com/path/to/resource',
          }]);
        });
    });

    it('Caches results', () => {
      const result = { };
      rp.mockImplementationOnce(() => Bluebird.resolve(result));

      return Bluebird.all([
        connector.get('/path/to/resource'),
        connector.get('/path/to/resource'),
      ])
        .then(r => {
          expect(r).toEqual([result, result]);
          expect(rp.mock.calls.length).toBe(1);
        });
    });
  });
});
