# LOLStats

### Development

Requires node 8 and yarn

Install dependencies

    $ yarn

Start development server

    $ LOL_API_KEY=XXX npm start

Run tests

    $ npm test



#### Or with Docker

Add your `LOL_API_KEY` to `docker-compose.dev.yml`

    $ docker-compose -f docker-compose.dev.yml up

### Production

Requires Docker and Heroku CLI.

    $ heroku create
    $ heroku config:set LOL_API_KEY=XXX
    $ heroku container:push web
    $ heroku open
