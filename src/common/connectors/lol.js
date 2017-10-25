import rp from 'request-promise';
import Bluebird from 'bluebird';
import moment from 'moment';
import DataLoader from 'dataloader';
import { mapValues, toPairs } from 'lodash';

import Limiter from 'common/limiters/limiter';
import regions from 'static/regions';

const API_KEY = 'RGAPI-3b05f6ba-0b53-4b77-8db2-89a226bb4116';

export const SUMMONERS = 'summoner-v3';
export const STATIC_DATA = 'static-data-v3';

/* limiters are singletons */
const regionLimiters = mapValues(regions, () => {
  const limiters = [
    Limiter(20, moment.duration(1, 'seconds')),
    Limiter(100, moment.duration(2, 'minutes')),
  ];

  return () => Bluebird.all(limiters.map(limiter => limiter()));
});

const methodLimiters = {
  '/lol/static-data/v3': Limiter(10, moment.duration(1, 'hour')),
  '/lol/summoner/v3': Limiter(600, moment.duration(1, 'minute')),
  '/lol/match/v3/matchlists': Limiter(1000, moment.duration(10, 'seconds')),
};

const findMethodLimiters = path => toPairs(methodLimiters)
  .filter(([match]) => path.startsWith(match))
  .map(([, limiter]) => limiter);

export default class LolConnector {
  constructor({ region } = {}) {
    this.region = region;
    this.apiRoot = `https://${regions[region].api}`;
    this.loader = new DataLoader(this.fetch.bind(this), {
      batch: false,
    });
  }

  fetch(requests) {
    const options = {
      headers: {
        'X-Riot-Token': API_KEY,
      },
      json: true,
    };

    return Bluebird.all(
      requests.map(path => {
        const limiters = [
          regionLimiters[this.region],
          ...findMethodLimiters(path),
        ];

        const uri = `${this.apiRoot}/${path}`;
        return Bluebird.all(limiters.map(l => l()))
          .then(() => {
            console.log('requesting');
            return rp({
              ...options,
              uri,
            });
          })
          .catch(e => {
            if (e.statusCode === 404) {
              return Bluebird.resolve(null);
            }
            if (e.statusCode === 429) {
              console.info('429 received', e.response.headers);
            }
            return Promise.reject(e);
          });
      }),
    );
  }

  get(path) {
    return this.loader.load(path);
  }
}
