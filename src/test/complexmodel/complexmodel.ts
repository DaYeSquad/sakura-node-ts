// Copyright 2017 huteng (huteng@gagogroup.com). All rights reserved.,
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {SelectQuery} from "../../sqlquery/selectquery";
import {TableName, Column} from "../../base/decorator";
import {Model, SqlFlag, SqlType, SqlDefaultValue} from "../../base/model";


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


@TableName("enterprise_relationships")
export class EnterpriseRelationships extends Model {

  @Column("id", SqlType.INT, SqlFlag.PRIMARY_KEY, "主键ID", SqlDefaultValue.MAKE_RANDOM_ID())
  id: number;

  @Column("eid", SqlType.INT, SqlFlag.NOT_NULL)
  eid: number;

  @Column("uid", SqlType.INT, SqlFlag.NOT_NULL)
  uid: number;

  @Column("meta", SqlType.JSON, SqlFlag.NULLABLE)
  meta: any;
}

describe("关联表查询，返回两个model", () => {

  it("关联表查询，返回两个model", () => {
    let sqlQueryResult: any = {
      uid: 1,
      username: "蒋伟",
      display_name: "蒋小伟",
      meta: "no meta",
      created_at: 1111,
      updated_at: 2222,
      id: 12312311,
      eid: 333
    };
    let modelArray: any = [];
    modelArray.push(User);
    modelArray.push(EnterpriseRelationships);
    let mapResult = Model.multipleModelFromRow(sqlQueryResult, modelArray);


    let result: User & EnterpriseRelationships;
    result = Object.assign((result === undefined ? {} : result), ...mapResult.values());

    chai.expect(result["uid"]).to.be.equal(1);
    chai.expect(result["eid"]).to.be.equal(333);
    chai.expect(result["username"]).to.be.equal("蒋伟");
    chai.expect(result["displayName"]).to.be.equal("蒋小伟");
  });

});

