import rp from 'request-promise';
import Bluebird from 'bluebird';
import DataLoader from 'dataloader';

const API_KEY = 'RGAPI-12926404-8bf6-4649-a443-a061d5e91402';

export default class LolConnector {
  constructor({ apiDomain, apiKey } = {}) {
    this.apiRoot = `https://${apiDomain}`;
    this.apiKey = apiKey;
    this.loader = new DataLoader(this.fetch.bind(this), {
      batch: false,
    });
  }

  fetch(paths) {
    const options = {
      headers: {
        'X-Riot-Token': API_KEY,
      },
      json: true,
    };

    return Bluebird.all(
      paths.map(path => {
        const uri = `${this.apiRoot}/${path}`;
        return rp({
          ...options,
          uri,
        }).catch(e => {
          if (e.statusCode === 404) {
            return Bluebird.resolve(null);
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
