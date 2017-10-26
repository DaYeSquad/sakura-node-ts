// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {PgDriver} from "../../../database/postgres/pgdriver";
import {DriverType} from "../../../database/driveroptions";
import {DeleteQuery} from "../../../sqlquery/deletequery";
import {SelectQuery} from "../../../sqlquery/selectquery";
import {Column, TableName} from "../../../base/decorator";
import {Model, SqlDefaultValue, SqlFlag, SqlType} from "../../../base/model";
import {InsertQuery} from "../../../sqlquery/insertquery";
import {timestamp} from "../../../base/typedefines";
import {ReplaceQuery} from "../../../sqlquery/replacequery";
import {UpdateQuery} from "../../../sqlquery/updatequery";
import {PgQueryBuilder} from "../../../database/postgres/pgquerybuilder";
import {AddModelOperation} from "../../../database/migration/operation";

@TableName("users")
class TestSelectUser extends Model {
  @Column("uid", SqlType.INT, SqlFlag.PRIMARY_KEY)
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
  updatedAt: number;
}

@TableName("users")
class TestInsertUser extends Model {

  @Column("uid", SqlType.INT, SqlFlag.PRIMARY_KEY)
  uid: number;

  @Column("username", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;

  @Column("display_name", SqlType.VARCHAR_255, SqlFlag.NULLABLE)
  displayName: string;

  @Column("age", SqlType.INT, SqlFlag.NULLABLE)
  age: number;

  initAsNewUser(username: string,  displayName?: string, age?: number) {
    this.username = username;
    this.displayName = displayName;
    this.age = age;
  }
}

@TableName("users")
class TestUpdateQueryUser extends Model {
  @Column("uid", SqlType.INT, SqlFlag.PRIMARY_KEY)
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
  updatedAt: number;
}

@TableName("users")
class TestCreateTableUser extends Model {
  @Column("uid", SqlType.INT, SqlFlag.PRIMARY_KEY, "系统编号，唯一标识", SqlDefaultValue.MAKE_RANDOM_ID())
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
  updatedAt: number;
}

@TableName("enterprises")
class Enterprise extends Model {
  @Column("eid", SqlType.INT, SqlFlag.PRIMARY_KEY, "系统编号，唯一标识", SqlDefaultValue.SERIAL())
  eid: number;

  @Column("name", SqlType.VARCHAR_255, SqlFlag.NOT_NULL, "企业名")
  name: string;
}

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

  init(uri: string, alias: string, meta: any, expiresAt: timestamp) {
    this.uri = uri;
    this.alias = alias;
    this.meta = meta;
    this.expiresAt = expiresAt;
  }
}

describe("PgQueryBuilder", () => {

  let queryBuilder: PgQueryBuilder;

  before(() => {
    queryBuilder = new PgQueryBuilder();
  });

  describe("Test buildDeleteQuery", () => {
    it("Test buildDeleteQuery", () => {
      let query: DeleteQuery = new DeleteQuery().from("users");
      const sql: string = queryBuilder.buildDeleteQuery(query);
      chai.expect(sql).to.equal("DELETE FROM users;");
    });
  });

  describe("Test buildSelectQuery", () => {
    it("查询语句 添加JOIN USING 查询全部属性", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().joinUsing(`join enterprise_relationships using(uid)`)
        .joinUsing(`join enterprises using(enterprise_id)`).where(` enterprises.enterprise_id = 115237134`);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT uid,username,displayName,meta,createdAt,updatedAt FROM users join enterprise_relationships using(uid)  join enterprises using(enterprise_id)  WHERE  enterprises.enterprise_id = 115237134`);
    });

    it("查询语句 添加JOIN USING 查询部分属性", () => {

      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select(["users.username", "enterprises.enterprise_id"]).joinUsing(`join enterprise_relationships using(uid)`)
        .joinUsing(`join enterprises using(enterprise_id)`).where(` enterprises.enterprise_id = 115237134`);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprises.enterprise_id FROM users join enterprise_relationships using(uid)  join enterprises using(enterprise_id)  WHERE  enterprises.enterprise_id = 115237134`);
    });

    it("查询语句 join in 关联查询", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select(["users.username", "enterprise_relationships.eid"])
                              .join("enterprise_relationships").on("enterprise_relationships.uid = users.uid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprise_relationships.eid FROM users JOIN enterprise_relationships ON (enterprise_relationships.uid = users.uid)`);
    });

    it("查询语句 left join in 关联查询", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select(["users.username", "enterprise_relationships.eid"])
                              .leftJoin("enterprise_relationships").on("enterprise_relationships.uid = users.uid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprise_relationships.eid FROM users LEFT JOIN enterprise_relationships ON (enterprise_relationships.uid = users.uid)`);
    });

    it("查询语句 多个 join in 关联查询", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select(["users.username", "enterprise_relationships.eid", "enterprises.name"])
                              .join("enterprise_relationships").on("enterprise_relationships.uid = users.uid")
                              .join("enterprises").on("enterprise_relationships.eid = enterprises.eid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprise_relationships.eid,enterprises.name FROM users JOIN enterprise_relationships ON (enterprise_relationships.uid = users.uid) JOIN enterprises ON (enterprise_relationships.eid = enterprises.eid)`);
    });

    it("查询语句 添加OFFSET", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().setOffset(1);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT uid,username,displayName,meta,createdAt,updatedAt FROM users OFFSET 1`);
    });

    it("查询语句 添加OFFSET 负数则不设置OFFSET", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().setOffset(-1);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT uid,username,displayName,meta,createdAt,updatedAt FROM users`);
    });

    it("查询语句 添加groupBy ", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().groupBy("username");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT uid,username,displayName,meta,createdAt,updatedAt FROM users GROUP BY username`);
    });

    it("查询语句 添加groupBy 两个参数 ", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().groupBy("username", "uid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT uid,username,displayName,meta,createdAt,updatedAt FROM users GROUP BY username,uid`);
    });

    it("查询语句 添加groupBy 数组参数 ", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().groupBy(...["username", "uid"]);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT uid,username,displayName,meta,createdAt,updatedAt FROM users GROUP BY username,uid`);
    });
  });

  describe("Test buildInsertQuery", () => {
    it("Test buildInsertQuery", () => {
      let user: TestInsertUser = new TestInsertUser();
      user.initAsNewUser("pig");
      const query: InsertQuery = new InsertQuery().fromModel(user);
      const sql: string = queryBuilder.buildInsertQuery(query);
      chai.expect(sql).to.equal(`INSERT INTO users (username) VALUES ('pig') RETURNING uid;`);
    });

    it("Test buildInsertQuery by table, set key - value handly", () => {
      const query: InsertQuery = new InsertQuery().fromTable("users").set(["username", "uid"]).value(["huteng", 1]).returning("uid");
      const sql: string = queryBuilder.buildInsertQuery(query);
      chai.expect(sql).to.equal(`INSERT INTO users (username,uid) VALUES (huteng,1) RETURNING uid;`);
    });
  });

  describe("Test buildReplaceQuery", () => {
    it("Test buildReplaceQuery", () => {
      let weatherCache: WeatherCacheInfo = new WeatherCacheInfo();
      weatherCache.init("forecast_temperatures", "shuye_dikuai_1", {}, 1476842006);
      const query: ReplaceQuery =
        new ReplaceQuery()
          .fromClass(WeatherCacheInfo)
          .where(`uri='${weatherCache.uri}'`, `alias='${weatherCache.alias}'`)
          .set("uri", weatherCache.uri, SqlType.VARCHAR_255)
          .set("alias", weatherCache.alias, SqlType.VARCHAR_255)
          .set("expires_at", weatherCache.expiresAt, SqlType.TIMESTAMP);
      const sql: string = queryBuilder.buildReplaceQuery(query);
      chai.expect(sql).to.equal(`UPDATE _weather_caches SET uri='forecast_temperatures',alias='shuye_dikuai_1',expires_at=to_timestamp(1476842006) WHERE uri='forecast_temperatures' AND alias='shuye_dikuai_1';
            INSERT INTO _weather_caches (uri,alias,expires_at)
            SELECT 'forecast_temperatures','shuye_dikuai_1',to_timestamp(1476842006)
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
      const query: UpdateQuery = new UpdateQuery().tableNameFromClass(TestUpdateQueryUser).set("kind", "Dramatic").where(`kind='Drama'`);
      const sql: string = queryBuilder.buildUpdateQuery(query);
      chai.expect(sql).to.equal(`UPDATE users SET kind='Dramatic' WHERE kind='Drama';`);
    });

    it("更新语句添加set 过滤属性值为空的属性", () => {
      let user: TestUpdateQueryUser = new TestUpdateQueryUser();
      user.uid = 1;
      user.username = "hello";
      const query: UpdateQuery  = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`);
      const sql: string = queryBuilder.buildUpdateQuery(query);
      chai.expect(sql).to.equal(`UPDATE users SET username='hello' WHERE  uid = 1;`);
    });

    it("更新语句 JSON类型字段添加表达式", () => {
      let user: TestUpdateQueryUser = new TestUpdateQueryUser();
      user.uid = 1;
      user.meta = {version: 1, test: "aaaa"};
      const query: UpdateQuery  = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`);
      const sql: string = queryBuilder.buildUpdateQuery(query);
      chai.expect(sql).to.equal(`UPDATE users SET meta='{"version":1,"test":"aaaa"}'::json WHERE  uid = 1;`);
    });

    it("更新语句 TIMESTAMP类型字段 转换时间戳", () => {
      let user: TestUpdateQueryUser = new TestUpdateQueryUser();
      user.uid = 1;
      user.createdAt = new Date();
      user.updatedAt = Math.floor(new Date().getTime() / 1000);
      const query: UpdateQuery  = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`);
      const sql: string = queryBuilder.buildUpdateQuery(query);
      chai.expect(sql).to.equal(`UPDATE users SET created_at=to_timestamp(${user.updatedAt}),updated_at=to_timestamp(${user.updatedAt}) WHERE  uid = 1;`);
    });
  });

  describe("Test buildAddModelOperation", () => {
    it("Test buildAddModelOperation", () => {
      let expectResult: string = `CREATE TABLE IF NOT EXISTS users (
uid INTEGER PRIMARY KEY DEFAULT make_random_id(), --系统编号，唯一标识
username VARCHAR(255),
display_name VARCHAR(255),
meta JSON,
created_at TIMESTAMP,
updated_at TIMESTAMP
);`;
      const operation: AddModelOperation = new AddModelOperation(TestCreateTableUser);
      let sql: string = queryBuilder.buildAddModelOperation(operation);

      chai.expect(sql).to.equal(expectResult);
    });
  });

  describe("Test buildAddModelOperation", () => {
    it("Test generateCreateTableSql with model whose ID is SERIAL", () => {
      const expectResult: string = `CREATE TABLE IF NOT EXISTS enterprises (
eid SERIAL  PRIMARY KEY , --系统编号，唯一标识
name VARCHAR(255) --企业名
);`;

      const operation: AddModelOperation = new AddModelOperation(Enterprise);
      const sql: string = queryBuilder.buildAddModelOperation(operation);
      chai.expect(sql).to.equal(expectResult);
    });
  });
});
