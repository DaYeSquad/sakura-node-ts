[![NPM Version][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/DaYeSquad/sakura-node-ts.svg?branch=master)](https://travis-ci.org/DaYeSquad/sakura-node-ts)


# OVERVIEW

Utility of building back end serviced in [Gago Group](https://gagogroup.cn/).


# FEATURES

* ORM: Supports PostgreSQL ORM and migration

* HTTP: Wrapper of Request/Response

* Frequently used Express middleware

* Email service: Wraps Aliyun Email Service


# EXAMPLE

See `src/example`.


# BUILD

Run `gulp` and all releases will be under `./lib`.


# TEST

We highly recommend to use docker as test database container, for MySQL, you can use [this image](https://hub.docker.com/_/mysql/), 
run `docker run --name mysql-docker -p 3307:3306 -e MYSQL_ROOT_PASSWORD=111111 -e MYSQL_DATABASE=gagotest -v /tmp/mysql:/var/lib/mysql -d mysql:latest`

`npm test`


# INSTALL

`npm install sakura-node-3`


# LINT

Use [tslint](https://palantir.github.io/tslint/usage/cli/). Run `sh ./bin/tslint.sh` before commit.


# RUNTIME

Node 7.x


[npm-url]: https://www.npmjs.com/package/sakura-node-3
