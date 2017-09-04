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

```TypeScript
@TableName("users")
export class User extends Model {
  @Column("uid", SqlType.INT, SqlFlag.PRIMARY_KEY, "主键")
  uid: number;

  @Column("username", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;

  @Column("display_name", SqlType.VARCHAR_255, SqlFlag.NULLABLE, "真实姓名")
  displayName: string;

  @Column("meta", SqlType.JSON, SqlFlag.NULLABLE)
  meta: any;

  @Column("created_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  createdAt: Date;

  @Column("updated_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  updatedAt: number;
}

(async () => {
  try {
    const driverOptions: DriverOptions = {
      type: DriverType.MYSQL,
      username: "root",
      password: "111111",
      host: "localhost",
      database: "gagodata"
    };

    // 使用 Migration 新建 users 表
    let migration: Migration = new Migration({
      version: 7,
      appName: "api-server-6",
      driverOptions: driverOptions
    });

    migration.addModel(User);

    await migration.migrate();

    // 创建 DBClient 全局单例
    DBClient.createClient(driverOptions);

    const fetchUsersQuery: SelectQuery = new SelectQuery().fromClass(User).select();
    const result: QueryResult = await DBClient.getClient().query(fetchUsersQuery);
    console.log(`there are ${result.rows.length} users`);
  } catch (err) {
    console.log(err);
  }
})();
```

For more information, see `src/example`.


# BUILD

Run `gulp` and all releases will be under `./lib`.


# TEST

We highly recommend to use docker as test database container, for MySQL, you can use [this image](https://hub.docker.com/_/mysql/), 
run `docker run --name mysql-docker -p 3307:3306 -e MYSQL_ROOT_PASSWORD=111111 -e MYSQL_DATABASE=gagotest -v /tmp/mysql:/var/lib/mysql -d mysql:latest`

`npm test`


# INSTALL

`npm install sakura-node-3`


# TIPS

Master-slave mode is not natively supported in our project, try to use queryBuilder directly.


# LINT

Use [tslint](https://palantir.github.io/tslint/usage/cli/). Run `sh ./bin/tslint.sh` before commit.


# RUNTIME

Node 6.11.0


[npm-url]: https://www.npmjs.com/package/sakura-node-3
