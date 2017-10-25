import Bluebird from 'bluebird';
import { RateLimiter } from 'limiter';

export default (requests, duration) => {
  const context = new RateLimiter(requests, duration.asMilliseconds());
  const limiter = Bluebird.promisify(context.removeTokens, { context });
  return () => limiter(1);
};
