# OVERVIEW

sakura-node-ts is a quick start project, it stores most of data in PostgreSQL, logs in MongoDB and it uses Redis to keep
user login token.

# BEFORE BUILD

1. Install node and npm
2. Install PostgreSQL
3. Install Redis
4. Install MongoDB

# SET ENVIRONMENT

You should set `NODE_ENV` before gulp server, on local machine, `NODE_ENV` should be `development`, on development 
server (Azure), should be `development_server`, on production server (Aliyun), should be `production`.

# BUILD PROJECT

1. npm install
2. gulp ts

Or you can see `./bin/setup_<system>.sh` for help.

# START

Use `sh ./bin/start_local_server.sh` to start service on local machine,
use `sh ./bin/development_server.sh` to start development (aka test) server on Azure,
use `sh ./bin/start_production_server.sh` to start production server on Aliyun.

# RUNTIME

TypeScript 2.x

# GULP

1. `gulp publish` to compile TypeScript into JavaScript under `./dist` folder.
2. `gulp server` to serve `./dist/app.js`.

# TEST

`mocha ./dist --recursive` or `npm test`.

# RELEASE

See `./bin` folder for scripts.

# BUILD API DOC

We use [API Blueprint](https://apiblueprint.org/) to write docs.
Run `sh ./bin/gen_api_docs.sh` to generate html document under `./public/docs` folder ([aglio](https://github.com/danielgtaylor/aglio) is required).