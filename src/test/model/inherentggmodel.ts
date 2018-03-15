// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {Column, TableName} from "../../base/decorator";
import {SqlFlag, SqlType} from "../../base/model";
import {MySqlQueryBuilder} from "../../database/mysql/mysqlquerybuilder";
import {InsertQuery} from "../../sqlquery/insertquery";
import {GGModel} from "../../gg/ggmodel";
import {SelectQuery} from "../../sqlquery/selectquery";
import {readdirSync} from "fs";

@TableName("users")
class User extends GGModel {

  @Column("username", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;
}


describe("GGModel", () => {

  let queryBuilder: MySqlQueryBuilder;

  before(() => {
    queryBuilder = new MySqlQueryBuilder();
  });

  it("Test User that inherent GGModel that should take three additional parameters in InsertQuery", () => {
    let user: User = new User();
    user.username = "franklin";
    user.createdAt = 1515140547;
    user.updatedAt = 1515140547;
    user.isDeleted = false;

    const insertQuery: InsertQuery = new InsertQuery().fromModel(user);
    const result: string = queryBuilder.buildInsertQuery(insertQuery);
    chai.expect(result).to.equal("INSERT INTO users (username,created_at,updated_at,is_deleted) VALUES ('franklin',FROM_UNIXTIME(1515140547),FROM_UNIXTIME(1515140547),false)");
  });

  it("Test User that inherent GGModel that should take three additional parameters in SelectQuery", () => {
    const selectQuery: SelectQuery = new SelectQuery().fromClass(User).select();
    const result: string = queryBuilder.buildSelectQuery(selectQuery);
    chai.expect(result).to.equal("SELECT username,created_at,updated_at,is_deleted FROM users");
  });

  /*
  it("Test use parameters in the where SQL statement in SelectQuery", () => {
    const selectQuery: SelectQuery = new SelectQuery().fromClass(User).select().whereWithParam("user.name = :name and user.is_deleted = :is_deleted", {
      name: "franklin",
      is_deleted: false
    });
    const result: string = queryBuilder.buildSelectQuery(selectQuery);
    chai.expect(result).to.equal("SELECT username,created_at,updated_at,is_deleted FROM users WHERE user.name = 'franklin' and user.is_deleted = false");
  });
  */
});
