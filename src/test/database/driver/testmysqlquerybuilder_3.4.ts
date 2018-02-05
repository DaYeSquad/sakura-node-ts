// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {MySqlQueryBuilder} from "../../../database/mysql/mysqlquerybuilder";
import {Model, SqlDefaultValue, SqlFlag, SqlType} from "../../../base/model";
import {Column, TableName} from "../../../base/decorator";
import {InsertQuery} from "../../../sqlquery/insertquery";
import {GGModel} from "../../../gg/ggmodel";
import {UpdateQuery} from "../../../sqlquery/updatequery";

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


describe("MySqlQueryBuilder", () => {

  let queryBuilder: MySqlQueryBuilder;

  before(() => {
    queryBuilder = new MySqlQueryBuilder();
  });

  it("Test buildInsertQuery with UUID as primary key", () => {
    let user: User = new User();
    user.username = "franklin";

    const insertQuery: InsertQuery = new InsertQuery().fromModel(user);
    const result: string = queryBuilder.buildInsertQuery(insertQuery);
    chai.expect(result).to.match(/INSERT INTO users \(username\,uid\) VALUES \(\'franklin\'\,\'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\'\)\; SELECT \'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\' AS uid\;/)
  });

  it("Test buildInsertQuery(GGModel) should take three default parameters", () => {
    let user: GGUser = new GGUser();
    user.username = "franklin";

    const insertQuery: InsertQuery = new InsertQuery().fromModel(user);
    const result: string = queryBuilder.buildInsertQuery(insertQuery);
    chai.expect(result.substr(0, 95)).to.equal("INSERT INTO users (username,created_at,updated_at,is_deleted) VALUES ('franklin',FROM_UNIXTIME(");
  });

  it("Test buildUpdateQuery(GGModel) should take default updatedAt when it is not given", () => {
    let user: GGUser = new GGUser();
    user.username = "franklin";

    const updateQuery: UpdateQuery = new UpdateQuery().fromModel(user).where(`uid=1`);
    const result: string = queryBuilder.buildUpdateQuery(updateQuery);
    chai.expect(result.substr(0, 62)).to.equal("UPDATE users SET username='franklin',updated_at=FROM_UNIXTIME(");
    chai.expect(result.substr(72)).to.equal("),is_deleted=false WHERE uid=1;");
  });
});
