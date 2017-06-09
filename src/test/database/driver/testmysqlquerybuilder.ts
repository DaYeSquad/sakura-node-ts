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
import {AddModelOperation} from "../../../database/migration/operation";
import {Version} from "../../../database/migration/version";

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

describe("MySqlQueryBuilder", () => {

  let queryBuilder: MySqlQueryBuilder;

  before(() => {
    queryBuilder = new MySqlQueryBuilder();
  });


  describe("Test buildSelectQuery", () => {
    it("查询语句 添加JOIN USING 查询全部属性", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().joinUsing(`join enterprise_relationships using(uid)`)
        .joinUsing(`join enterprises using(enterprise_id)`).where(` enterprises.enterprise_id = 115237134`);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users join enterprise_relationships using(uid)  join enterprises using(enterprise_id)  WHERE  enterprises.enterprise_id = 115237134`);
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

    it("查询语句 多个 join in 关联查询", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select(["users.username", "enterprise_relationships.eid", "enterprises.name"])
                              .join("enterprise_relationships").on("enterprise_relationships.uid = users.uid")
                              .join("enterprises").on("enterprise_relationships.eid = enterprises.eid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprise_relationships.eid,enterprises.name FROM users JOIN enterprise_relationships ON (enterprise_relationships.uid = users.uid) JOIN enterprises ON (enterprise_relationships.eid = enterprises.eid)`);
    });

    it("查询语句 添加LIMIT", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().setLimit(3);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users LIMIT 3`);
    });

    it("查询语句 添加LIMIT后，添加OFFSET", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().setLimit(2).setOffset(1);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users LIMIT 2 OFFSET 1`);
    });

    it("查询语句 添加OFFSET 负数则不设置OFFSET", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().setOffset(-1);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users`);
    });

    it("查询语句 添加groupBy ", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().groupBy("username");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users GROUP BY username`);
    });

    it("查询语句 添加groupBy 两个参数 ", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().groupBy("username", "uid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users GROUP BY username,uid`);
    });

    it("查询语句 添加groupBy 数组参数 ", () => {
      const query: SelectQuery = new SelectQuery().fromClass(TestSelectUser).select().groupBy(...["username", "uid"]);
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT * FROM users GROUP BY username,uid`);
    });
  });

  // describe("Test buildInsertQuery", () => {
  //   it("Test buildInsertQuery", () => {
  //     let user: TestInsertUser = new TestInsertUser();
  //     user.initAsNewUser("pig");
  //     const query: InsertQuery = new InsertQuery().fromModel(user);
  //     const sql: string = queryBuilder.buildInsertQuery(query);
  //     chai.expect(sql).to.equal(`INSERT INTO users (username) VALUES ('pig'); SELECT last_insert_id();`);
  //   });
  // });

  // describe("Test buildReplaceQuery", () => {
  //   it("Test buildReplaceQuery", () => {
  //     let weatherCache: WeatherCacheInfo = new WeatherCacheInfo();
  //     weatherCache.init("forecast_temperatures", "shuye_dikuai_1", {}, 1476842006);
  //     const query: ReplaceQuery =
  //       new ReplaceQuery()
  //         .fromClass(WeatherCacheInfo)
  //         .where(`uri='${weatherCache.uri}'`, `alias='${weatherCache.alias}'`)
  //         .set("uri", weatherCache.uri, SqlType.VARCHAR_255)
  //         .set("alias", weatherCache.alias, SqlType.VARCHAR_255)
  //         .set("expires_at", weatherCache.expiresAt, SqlType.TIMESTAMP);
  //     const sql: string = queryBuilder.buildReplaceQuery(query);
  //     chai.expect(sql).to.equal(`UPDATE _weather_caches SET uri='forecast_temperatures',alias='shuye_dikuai_1',expires_at=to_timestamp(1476842006) WHERE uri='forecast_temperatures' AND alias='shuye_dikuai_1';
  //           INSERT INTO _weather_caches (uri,alias,expires_at)
  //           SELECT 'forecast_temperatures','shuye_dikuai_1',to_timestamp(1476842006)
  //           WHERE NOT EXISTS (SELECT 1 FROM _weather_caches WHERE uri='forecast_temperatures' AND alias='shuye_dikuai_1');`);
  //   });
  // });


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

  describe("Test buildAddModelOperation", () => {
    it("Test buildAddModelOperation", () => {
      const expectSql: string = `CREATE TABLE IF NOT EXISTS \`version\` (
id INT AUTO_INCREMENT, -- 唯一编码
\`version\` INT, -- 版本号
\`app_name\` VARCHAR(255) -- 应用名称
,
PRIMARY KEY (\`id\`));`;
      const addModelOperation: AddModelOperation = new AddModelOperation(Version);
      const sql: string = queryBuilder.buildAddModelOperation(addModelOperation);
      chai.expect(sql).to.equal(expectSql);
    });
  });
});
