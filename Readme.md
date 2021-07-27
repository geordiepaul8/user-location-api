# User Location API

An API which calls an upstream service located at: `https://bpdts-test-app.herokuapp.com/` and returns a list of users that either live in London or live within 50 miles of London.

## Getting started

Setup:

```bash
# Install dependencies - you will need Node v14 LTS
npm ci

# Test (and coverage)
npm test
npm run quality

# Integration tests - this will run a package called Testcontainers
npm run test:integration

# Compliance (linting)
npm run compliance

# Run all of the above in one convenient method
npm run pipeline
```

Start the service locally on your machine, using a pre-bundled configuration (in `.env.example`):

```bash
# You can specify a config file like this ...
npm start -- --config=.env.example

# Or you can pass environment variables in, like this ...
PORT=1234 npm start

# Or a combination of both ...
PORT=1234 npm start -- --config=.env.example
```


Packaging docker image:

Build the container

```bash
docker build -t user-location-api -f docker/Dockerfile . 
```

Run the container

```bash
# Note we are using the .env.example file for default values.
docker run -p 3000:3000 \
    --env-file=.env.example \
    -it \
    --rm \
    --name user-location-api \
    user-location-api
```

## Logging

This API is using the [dwp node logger](https://www.npmjs.com/package/@dwp/node-logger) for all logging needs. This echos JSON logs to `stdout`, in a format that matches our defined logging structure.

## Environment variables

| Environment Variable       | Description                                   |       default                         |           
| ---------------------------|-----------------------------------------------|---------------------------------------|
| NODE_ENV                   |  Host node environment                        | development                           |
| DEBUG                      |  Set basic debugging                          | *                                     |
| PORT                       |  Application listening port                   | 3000                                  |
| LOG_LEVEL                  |  log level                                    | info                                  |
| USER_LOCATION_API_BASE_URL | the url of the upstream API                   | https://bpdts-test-app.herokuapp.com/ |
| HTTP_TIMEOUT               | the timeout applied to http calls             | 10 (s)                                |


## API Definition

Attached to the repo is a swagger definition file named: `open-api.swagger.yaml`.


## Endpoints
The following urls are available:

`/health` : Returns status of 200 & message: `UP`

`/users` : Returns an array of users that live in London or within (<50 miles) of London.

Note: the list of users returned will only contain the following fields:

-   id
-   first_name
-   last_name