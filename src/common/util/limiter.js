import Bluebird from 'bluebird';
import { RateLimiter } from 'limiter';

export default (requests, duration) => {
  const ms = Math.ceil(duration.asMilliseconds() / requests);

  const limiter = new RateLimiter(1, ms);

  return () => new Bluebird(resolve =>
    limiter.removeTokens(1, () => resolve()));
};
