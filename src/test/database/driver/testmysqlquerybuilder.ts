// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {SelectQuery} from "../../../sqlquery/selectquery";
import {Column, TableName} from "../../../base/decorator";
import {Model, SqlFlag, SqlType} from "../../../base/model";
import {MySqlQueryBuilder} from "../../../database/mysql/mysqlquerybuilder";
import {AddColumnOperation, AddCommentOperation, AddModelOperation} from "../../../database/migration/operation";
import {Version} from "../../../database/migration/version";

@TableName("users")
class User extends Model {
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
      const query: SelectQuery = new SelectQuery().fromClass(User).select(["users.username", "enterprise_relationships.eid"])
                              .join("enterprise_relationships").on("enterprise_relationships.uid = users.uid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprise_relationships.eid FROM users JOIN enterprise_relationships ON (enterprise_relationships.uid = users.uid)`);
    });

    it("查询语句 多个 join in 关联查询", () => {
      const query: SelectQuery = new SelectQuery().fromClass(User).select(["users.username", "enterprise_relationships.eid", "enterprises.name"])
                              .join("enterprise_relationships").on("enterprise_relationships.uid = users.uid")
                              .join("enterprises").on("enterprise_relationships.eid = enterprises.eid");
      const sql: string = queryBuilder.buildSelectQuery(query);
      chai.expect(sql).to.equal(`SELECT users.username,enterprise_relationships.eid,enterprises.name FROM users JOIN enterprise_relationships ON (enterprise_relationships.uid = users.uid) JOIN enterprises ON (enterprise_relationships.eid = enterprises.eid)`);
    });
  });

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
});
