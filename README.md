# LOLStats

### Development

Install dependencies

    $ yarn

Start development server

    $ LOL_API_KEY=XXX npm run start

#### Or with docker

Add your `LOL_API_KEY` to `docker-compose.dev.yml`

    $ docker-compose -f docker-compose.dev.yml up

### Production

Production build is a docker container running on Heroku

    $ heroku create
    $ heroku config:set LOL_API_KEY=XXX
    $ heroku container:push web
    $ heroku open