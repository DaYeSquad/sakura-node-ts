// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {SelectQuery} from "../../../sqlquery/selectquery";
import {InsertQuery} from "../../../sqlquery/insertquery";
import {ReplaceQuery} from "../../../sqlquery/replacequery";
import {UpdateQuery} from "../../../sqlquery/updatequery";
import {Column, TableName} from "../../../base/decorator";
import {timestamp} from "../../../base/typedefines";
import {Model, SqlDefaultValue, SqlFlag, SqlType} from "../../../base/model";
import {MySqlQueryBuilder} from "../../../database/mysql/mysqlquerybuilder";
import {
  AddColumnOperation, AddCommentOperation, AddModelOperation, ChangeColumnTypeOperation,
  DropColumnOperation, RenameColumnOperation
} from "../../../database/migration/operation";
import {Version} from "../../../database/migration/version";

@TableName("users")
class User extends Model {
  @Column("uid", SqlType.INT, SqlFlag.PRIMARY_KEY, "", SqlDefaultValue.MAKE_RANDOM_ID())
  uid: number;

  @Column("username", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;

  @Column("display_name", SqlType.VARCHAR_255, SqlFlag.NULLABLE)
  displayName: string;

  @Column("meta", SqlType.JSON, SqlFlag.NULLABLE)
  meta: any;

  @Column("created_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  createdAt: Date;

  @Column("updated_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  updatedAt: timestamp;

  initAsNewUser(uid: number, displayName: string, username: string, meta: any, updatedAt: timestamp, createdAt: Date) {
    this.uid = uid;
    this.displayName = displayName;
    this.username = username;
    this.meta = meta;
    this.updatedAt = updatedAt;
    this.createdAt = new Date(createdAt);
  }
}

describe("MySqlQueryBuilder", () => {

  let queryBuilder: MySqlQueryBuilder;

  before(() => {
    queryBuilder = new MySqlQueryBuilder();
  });

  describe("Test buildSelectQuery", () => {
    it("查询语句 添加JOIN USING 查询全部属性", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select().joinUsing(`join enterprise_relationships using(uid)`)
        .joinUsing(`join enterprises using(enterprise_id)`).where(` enterprises.enterprise_id = 115237134`);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users join enterprise_relationships using(uid)  join enterprises using(enterprise_id)  WHERE  enterprises.enterprise_id = 115237134`);
    });

    it("查询语句 添加JOIN USING 查询部分属性", () => {

      const query: SelectQuery = new SelectQuery().fromClass(User).select(["users.username", "enterprises.enterprise_id"]).joinUsing(`join enterprise_relationships using(uid)`)
        .joinUsing(`join enterprises using(enterprise_id)`).where(` enterprises.enterprise_id = 115237134`);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprises.enterprise_id FROM users join enterprise_relationships using(uid)  join enterprises using(enterprise_id)  WHERE  enterprises.enterprise_id = 115237134`);
    });

    it("查询语句 join in 关联查询", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select(["users.username", "enterprise_relationships.eid"])
                              .join("enterprise_relationships").on("enterprise_relationships.uid = users.uid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprise_relationships.eid FROM users JOIN enterprise_relationships ON (enterprise_relationships.uid = users.uid)`);
    });

    it("查询语句 left join in 关联查询", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select(["users.username", "enterprise_relationships.eid"])
                              .leftJoin("enterprise_relationships").on("enterprise_relationships.uid = users.uid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprise_relationships.eid FROM users LEFT JOIN enterprise_relationships ON (enterprise_relationships.uid = users.uid)`);
    });

    it("查询语句 多个 join in 关联查询", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select(["users.username", "enterprise_relationships.eid", "enterprises.name"])
                              .join("enterprise_relationships").on("enterprise_relationships.uid = users.uid")
                              .join("enterprises").on("enterprise_relationships.eid = enterprises.eid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprise_relationships.eid,enterprises.name FROM users JOIN enterprise_relationships ON (enterprise_relationships.uid = users.uid) JOIN enterprises ON (enterprise_relationships.eid = enterprises.eid)`);
    });

    it("查询语句 添加LIMIT", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select().setLimit(3);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users LIMIT 3`);
    });

    it("查询语句 添加LIMIT后，添加OFFSET", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select().setLimit(2).setOffset(1);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users LIMIT 2 OFFSET 1`);
    });

    it("查询语句 添加OFFSET 负数则不设置OFFSET", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select().setOffset(-1);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users`);
    });

    it("查询语句 添加groupBy ", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select().groupBy("username");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users GROUP BY username`);
    });

    it("查询语句 添加groupBy 两个参数 ", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select().groupBy("username", "uid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users GROUP BY username,uid`);
    });

    it("查询语句 添加groupBy 数组参数 ", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select().groupBy(...["username", "uid"]);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users GROUP BY username,uid`);
    });
  });

@TableName("_weather_caches")
class WeatherCacheInfo extends Model {

  @Column("id", SqlType.INT, SqlFlag.PRIMARY_KEY)
  private id_: number;

  @Column("uri", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  uri: string;

  @Column("alias", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  alias: string;

  @Column("meta", SqlType.JSON, SqlFlag.NOT_NULL)
  meta: any = {};

  @Column("expires_at", SqlType.TIMESTAMP, SqlFlag.NOT_NULL)
  expiresAt: timestamp;

  initAsNewWeatherCache(uri: string, alias: string, meta: any, expiresAt: timestamp) {
    this.uri = uri;
    this.alias = alias;
    this.meta = meta;
    this.expiresAt = expiresAt;
  }
}

  describe("Test buildAddModelOperation", () => {
    it("Test buildAddModelOperation", () => {
      const expectSql: string = `CREATE TABLE IF NOT EXISTS \`version\` (
id INT AUTO_INCREMENT COMMENT '唯一编码',
\`version\` INT COMMENT '版本号',
\`app_name\` VARCHAR(255) COMMENT '应用名称'
,
PRIMARY KEY (\`id\`));`;
      const addModelOperation: AddModelOperation = new AddModelOperation(Version);
      const sql: string = queryBuilder.buildAddModelOperation(addModelOperation);
      chai.expect(sql).to.equal(expectSql);
    });
  });

  it("Test buildAddCommentOperation", () => {
    const expectSql: string | undefined = undefined;
    const addCommentOperation: AddCommentOperation = new AddCommentOperation(Version);
    const sql: string = queryBuilder.buildAddCommentOperation(addCommentOperation);
    chai.expect(sql).to.equal(expectSql);
  });

  it("Test buildAddColumnOperation", () => {
    const expectSql: string = `ALTER TABLE users ADD COLUMN new_column TEXT;`;
    const addColumnOperation: AddColumnOperation = new AddColumnOperation(User, {name: "new_column", type: SqlType.TEXT, flag: SqlFlag.NOT_NULL, comment: "测试新列"})
    const sql: string = queryBuilder.buildAddColumnOperation(addColumnOperation);
    chai.expect(sql).to.equal(expectSql);
  });

  it("Test buildDropColumnOperation", () => {
    const expectSql: string = `ALTER TABLE users DROP COLUMN new_column;`;
    const dropColumnOperation: DropColumnOperation = new DropColumnOperation(User, "new_column");
    const sql: string = queryBuilder.buildDropColumnOperation(dropColumnOperation);
    chai.expect(sql).to.equal(expectSql);
  });

  it("Test buildRenameColumnOperation", () => {
    const expectSql: string = `ALTER TABLE users CHANGE username username1 VARCHAR(255);`;
    const renameColumnOperation: RenameColumnOperation = new RenameColumnOperation(User, "username", "username1");
    const sql: string = queryBuilder.buildRenameColumnOperation(renameColumnOperation);
    chai.expect(sql).to.equal(expectSql);
  });

  it("Test buildChangeColumnTypeOperation", () => {
    const expectSql: string = `ALTER TABLE users MODIFY username TEXT;`;
    const resetTypeOperation: ChangeColumnTypeOperation = new ChangeColumnTypeOperation(User, "username", SqlType.TEXT);
    const sql: string = queryBuilder.buildChangeColumnTypeOperation(resetTypeOperation);
    chai.expect(sql).to.equal(expectSql);
  });

  describe("Test buildInsertQuery", () => {
    it("Test buildInsertQuery", () => {
      let user: User = new User();
      user.initAsNewUser(111, "pig", "jiangwei", `{"a":"hello","b":"world"}`, 188821212, new Date(1));
      const query: InsertQuery = new InsertQuery().fromModel(user);
      const sql: string = queryBuilder.buildInsertQuery(query);
      chai.expect(sql).to.equal(`INSERT INTO users (username,display_name,meta,created_at,updated_at,uid) VALUES ('jiangwei','pig','{"a":"hello","b":"world"}',FROM_UNIXTIME(Thu Jan 01 1970 08:00:00 GMT+0800 (CST)),FROM_UNIXTIME(188821212),make_random_id()); SELECT last_insert_id();`);
    });

    it("Test buildInsertQuery by table, set key - value handly", () => {
      const query: InsertQuery = new InsertQuery().fromTable("users").set(["username", "uid"]).value(["huteng", 1]);
      const sql: string = queryBuilder.buildInsertQuery(query);
      chai.expect(sql).to.equal(`INSERT INTO users (username,uid) VALUES (huteng,1); SELECT last_insert_id();`);
    });
  });

  describe("Test buildReplaceQuery", () => {
    it("Test buildReplaceQuery", () => {
      let weatherCache: WeatherCacheInfo = new WeatherCacheInfo();
      weatherCache.initAsNewWeatherCache("forecast_temperatures", "shuye_dikuai_1", {}, 1476842006);
      const query: ReplaceQuery =
        new ReplaceQuery()
          .fromClass(WeatherCacheInfo)
          .where(`uri='${weatherCache.uri}'`, `alias='${weatherCache.alias}'`)
          .set("uri", weatherCache.uri, SqlType.VARCHAR_255)
          .set("alias", weatherCache.alias, SqlType.VARCHAR_255)
          .set("expires_at", weatherCache.expiresAt, SqlType.TIMESTAMP);
      const sql: string = queryBuilder.buildReplaceQuery(query);
      chai.expect(sql).to.equal(`UPDATE _weather_caches SET uri='forecast_temperatures',alias='shuye_dikuai_1',expires_at=FROM_UNIXTIME(1476842006) WHERE uri='forecast_temperatures' AND alias='shuye_dikuai_1';
            INSERT INTO _weather_caches (uri,alias,expires_at)
            SELECT 'forecast_temperatures','shuye_dikuai_1',FROM_UNIXTIME(1476842006)
            WHERE NOT EXISTS (SELECT 1 FROM _weather_caches WHERE uri='forecast_temperatures' AND alias='shuye_dikuai_1');`);
    });
  });

  describe("Test buildUpdateQuery", () => {
    it("UpdateQuery with one set and where", () => {
      const query: UpdateQuery = new UpdateQuery().table("films").set("kind", "Dramatic").where(`kind='Drama'`);
      const sql: string = queryBuilder.buildUpdateQuery(query);
      chai.expect(sql).to.equal(`UPDATE films SET kind='Dramatic' WHERE kind='Drama';`);
    });

    it("UpdateQuery table name from class", () => {
      const query: UpdateQuery = new UpdateQuery().tableNameFromClass(User).set("kind", "Dramatic").where(`kind='Drama'`);
      const sql: string = queryBuilder.buildUpdateQuery(query);
      chai.expect(sql).to.equal(`UPDATE users SET kind='Dramatic' WHERE kind='Drama';`);
    });

    it("更新语句添加set 过滤属性值为空的属性", () => {
      let user: User = new User();
      user.uid = 1;
      user.username = "hello";
      const query: UpdateQuery  = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`);
      const sql: string = queryBuilder.buildUpdateQuery(query);
      chai.expect(sql).to.equal(`UPDATE users SET username='hello' WHERE  uid = 1;`);
    });

    it("更新语句 JSON类型字段添加表达式", () => {
      let user: User = new User();
      user.uid = 1;
      user.meta = {version: 1, test: "aaaa"};
      const query: UpdateQuery  = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`);
      const sql: string = queryBuilder.buildUpdateQuery(query);
      chai.expect(sql).to.equal(`UPDATE users SET meta='{"version":1,"test":"aaaa"}' WHERE  uid = 1;`);
    });

    it("更新语句 TIMESTAMP类型字段 转换时间戳", () => {
      let user: User = new User();
      user.uid = 1;
      user.createdAt = new Date();
      user.updatedAt = Math.floor(new Date().getTime() / 1000);
      const query: UpdateQuery  = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`);
      const sql: string = queryBuilder.buildUpdateQuery(query);
      chai.expect(sql).to.equal(`UPDATE users SET created_at=FROM_UNIXTIME(${user.updatedAt}),updated_at=FROM_UNIXTIME(${user.updatedAt}) WHERE  uid = 1;`);
    });
  });
});
