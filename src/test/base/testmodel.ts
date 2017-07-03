// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {Model} from "../../base/model";
import {User} from "../model/user";

describe("ORM", () => {
  it("Test ORM with User", () => {
    let sqlQueryResult: any = {
      uid: 1,
      username: "蒋伟",
      display_name: "蒋小伟",
      meta: {
        a: 10
      },
      created_at: 1111,
      updated_at: 2222,
      id: 12312311,
      eid: 333
    };

    let user: User = Model.modelFromRow(sqlQueryResult, User);
    chai.expect(user.username).to.equal("蒋伟");
    chai.expect(user.uid).to.equal(1);
  });
});
