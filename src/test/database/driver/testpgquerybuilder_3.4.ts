// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {Model, SqlDefaultValue, SqlFlag, SqlType} from "../../../base/model";
import {Column, TableName} from "../../../base/decorator";
import {InsertQuery} from "../../../sqlquery/insertquery";
import {PgQueryBuilder} from "../../../database/postgres/pgquerybuilder";
import {GGModel} from "../../../gg/ggmodel";
import {UpdateQuery} from "../../../sqlquery/updatequery";
import {ReplaceQuery} from "../../../sqlquery/replacequery";

@TableName("users")
class User extends Model {

  @Column("uid", SqlType.VARCHAR_255, SqlFlag.PRIMARY_KEY, "", SqlDefaultValue.UUID())
  uid: number;

  @Column("username", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;
}

@TableName("users")
class GGUser extends GGModel {

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

  it("Test buildInsertQuery(GGModel) should take three default parameters", () => {
    let user: GGUser = new GGUser();
    user.username = "franklin";

    const insertQuery: InsertQuery = new InsertQuery().fromModel(user);
    const result: string = queryBuilder.buildInsertQuery(insertQuery);
    chai.expect(result.substr(0, 94)).to.equal("INSERT INTO users (username,created_at,updated_at,is_deleted) VALUES ('franklin',to_timestamp(");
  });

  it("Test buildUpdateQuery(GGModel) should take default updatedAt when it is not given", () => {
    let user: GGUser = new GGUser();
    user.username = "franklin";

    const updateQuery: UpdateQuery = new UpdateQuery().fromModel(user).where(`uid=1`);
    const result: string = queryBuilder.buildUpdateQuery(updateQuery);
    chai.expect(result.substr(0, 61)).to.equal("UPDATE users SET username='franklin',updated_at=to_timestamp(");
    chai.expect(result.substr(71)).to.equal("),is_deleted=false WHERE uid=1;");
  });

  it("Test buildReplaceQuery(GGModel) should take 3 default value at first time", () => {
    const replaceQuery: ReplaceQuery = new ReplaceQuery()
      .fromClass(GGUser)
      .where(  `username="franklin"`)
      .set("username", "franklin", SqlType.VARCHAR_255);
    const result: string = queryBuilder.buildReplaceQuery(replaceQuery);
    console.log(result);
    chai.expect(result.substr(0, 61)).to.equal("UPDATE users SET username='franklin',updated_at=to_timestamp(");
  });
});
