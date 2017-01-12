// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {DeleteQuery} from "../../sqlquery/deletequery";

describe("Test delete query", () => {

  it("Test build from named table", () => {
    let sql: string = new DeleteQuery().from("users").build();
    chai.expect(sql).to.equal("DELETE FROM users");
  });
});
