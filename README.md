# 概述

Gago 后端最基础功能的库，以 ORM 为核心


# 功能

* 轻量级 ORM: 支持 PostgreSQL、MySQL，支持空间数据格式

* HTTP: Wrapper of Request/Response

* 常用的一些 Express 的 middleware，如 timeout、CORS 等

* Email service: 常用发信的封装


# 安装

`npm install sakura-node-3`


# ORM Example

## 最基本的 Mapping

```TypeScript
@TableName("users") // 声明当前类对应的表
export class User extends Model { // 需要 ORM 的类必须继承自 Model 或者是 GGModel，GGModel 会自动添加 is_deleted、created_at 和 updated_at 三个字段

  // 声明该属性对应的数据库中的属性，支持顺序罗列和 interface 两种形式
  // name(必填) 用于声明数据库中字段的名字
  // type(必填) 用于声明对应数据库中的类型，常见的有 INT、VARCHAR_255、VARCHAR_1024、TIMESTAMP、JSON、GEOMETRY
  // flag(必填) 用于声明一些情况，如是否是主键、是否可以为空，可选的有 PRIMARY_KEY、NOT_NULL、NULLABLE
  // comment(选填) 注释
  // defaultValue (选填) 默认值，支持随机数(MAKE_RANDOM_ID)、自增(SERIAL)、UUID(UUID)，推荐尽可能用自增
  @Column({ name: "uid", type: SqlType.INT, flag: SqlFlag.PRIMARY_KEY, comment: "主键"})
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
````

## Migration (数据库迁移)

```TypeScript
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

## MySQL Cluster 模式

```TypeScript
const driverOptions: DriverOptions = {
  type: DriverType.MYSQL,
  username: "root",
  password: "111111",
  database: "gago",
  clusterOptions: {
    master: {
      host: "172.169.21.48"
    },
    slaves: [
      {
        host: "172.169.21.49"
      },
      {
        host: "172.169.21.50"
      }
    ]
  }
};

// 创建 DBClient 全局单例
DBClient.createClient(driverOptions);

const fetchUsersQuery: SelectQuery = new SelectQuery().fromClass(User).select().whereWithParam("name = :name",{name : "franklin" });
const result: QueryResult = await DBClient.getClient().query(fetchUsersQuery);
console.log(`there are ${result.rows.length} users`);
```

更多的示例, 可以查看 `src/example`.


# 构建工程

Run `gulp` and all releases will be under `./lib`.


# 单元测试

We highly recommend to use docker as test database container, for MySQL, you can use [this image](https://hub.docker.com/_/mysql/), 
run `docker run --name mysql-docker -p 3307:3306 -e MYSQL_ROOT_PASSWORD=111111 -e MYSQL_DATABASE=gagotest -v /tmp/mysql:/var/lib/mysql -d mysql:latest`

`npm test`


# 代码规范

在提交代码前需要使用 tslint 在检查一次 [tslint](https://palantir.github.io/tslint/usage/cli/). (`sh ./bin/tslint.sh`)


# Node Runtime

Node 6.11.0
