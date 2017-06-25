// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * This test is to make sure we have solved the issue https://github.com/DaYeSquad/sakura-node-ts/issues/23
 */

import * as chai from "chai";

import {Model, SqlDefaultValue, SqlFlag, SqlType} from "../../base/model";
import {Column, TableName} from "../../base/decorator";
import {InsertQuery} from "../../sqlquery/insertquery";
import {QueryResult} from "../../database/queryresult";
import {DBClient} from "../../database/dbclient";
import {TestContext} from "../testcontext";
import {AddModelOperation} from "../../database/migration/operation";

@TableName("users")
class User extends Model {

  @Column({name: "uid", type: SqlType.BIGINT, flag: SqlFlag.PRIMARY_KEY, defaultValue: SqlDefaultValue.SERIAL()})
  uid: string;

  @Column({name: "username", type: SqlType.VARCHAR_255, flag: SqlFlag.NOT_NULL})
  username: string;
}

describe("Test DBClient Query when using MySQL", () => {
  before(() => {
    DBClient.createClient(TestContext.mySqlDriverOptions());
  });

  it("MySQL insert return id should be model primary key", async () => {
    // create table
    const op: AddModelOperation = new AddModelOperation(User);
    await DBClient.getClient().query(op);

    // test insert
    let user: User = new User();
    user.username = "frank";
    const query: InsertQuery = new InsertQuery().fromModel(user);
    const result: QueryResult = await DBClient.getClient().query(query);
    chai.expect(result.rows[0]["uid"]).to.exist;
  });
});
