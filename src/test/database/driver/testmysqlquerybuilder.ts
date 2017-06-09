// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {SelectQuery} from "../../../sqlquery/selectquery";
import {Column, TableName} from "../../../base/decorator";
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

describe("MySqlQueryBuilder", () => {
  
  let queryBuilder: MySqlQueryBuilder;

  before(() => {
    queryBuilder = new MySqlQueryBuilder();
  });


  describe("Test buildSelectQuery", () => {
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
  });

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
