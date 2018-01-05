// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {Model, SqlDefaultValue, SqlFlag, SqlType} from "../../../base/model";
import {Column, TableName} from "../../../base/decorator";
import {InsertQuery} from "../../../sqlquery/insertquery";
import {PgQueryBuilder} from "../../../database/postgres/pgquerybuilder";

@TableName("users")
class User extends Model {

  @Column("uid", SqlType.VARCHAR_255, SqlFlag.PRIMARY_KEY, "", SqlDefaultValue.UUID())
  uid: number;

  @Column("username", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;
}


describe("PgQueryBuilder", () => {

  let queryBuilder: PgQueryBuilder;

  before(() => {
    queryBuilder = new PgQueryBuilder();
  });

  it("Test buildInsertQuery with UUID as primary key", () => {
    let user: User = new User();
    user.username = "franklin";

    const insertQuery: InsertQuery = new InsertQuery().fromModel(user);
    const result: string = queryBuilder.buildInsertQuery(insertQuery);
    chai.expect(result.indexOf("INSERT INTO users (uid, username) VALUES")).to.not.equal(-1);
    chai.expect(result.indexOf("RETURNING uid;")).to.not.equal(-1);
  });
});
