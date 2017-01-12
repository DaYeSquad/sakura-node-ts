// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {TableName, Column} from "../../base/decorator";
import {Model, SqlType, SqlFlag, SqlDefaultValue} from "../../base/model";
import {sqlGenerator} from "../../tools/sqlgenerator";

@TableName("users")
class User extends Model {
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

describe("SqlGenerator", () => {

  it("Test generateCreateTableSql with normal model", () => {
    const expectResult: string = `CREATE TABLE IF NOT EXISTS users (
uid INTEGER PRIMARY KEY DEFAULT make_random_id(), --系统编号，唯一标识
username VARCHAR(255),
display_name VARCHAR(255),
meta JSON,
created_at TIMESTAMP,
updated_at TIMESTAMP
);`;

    const sql: string = sqlGenerator.generateCreateTableSql(User);
    chai.expect(sql).to.equal(expectResult);
  });

  it("Test generateCreateTableSql with model whose ID is SERIAL", () => {
    const expectResult: string = `CREATE TABLE IF NOT EXISTS enterprises (
eid SERIAL, --系统编号，唯一标识
name VARCHAR(255) --企业名
);`;

    const sql: string = sqlGenerator.generateCreateTableSql(Enterprise);
    chai.expect(sql).to.equal(expectResult);
  });
});
