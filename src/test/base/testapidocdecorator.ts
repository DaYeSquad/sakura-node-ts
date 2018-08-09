// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";
import {apiDoc} from "../../base/apidoc";
import {apiDocContext} from "../../util/apidoccontext";

class UserController {
  static async getUserInfo(): Promise<void> {}
}

apiDoc({
  function: UserController.getUserInfo,
  description: "获得所有用户信息",
  method: "GET",
  uri: "/products?{pid}",
  queryParameters: [
    {
      key: "pid",
      example: 5,
      type: "number",
      description: "产品的 ID"
    }
  ],
  requestHeaders: {
    "Token": "it-is-a-token"
  },
  responseBody: {
    "data": {
      "users": [
        {
          "uid": 1,
          "displayName": "linxiaoyi"
        },
        {
          "uid": 2,
          "displayName": "huangtaihu"
        }
      ]
    }
  }
});

describe("Test API doc decorator", () => {

  it("Test API doc decorator", () => {
    chai.expect(apiDocContext.apiBlueprintDocument()).to.equal("1");
  });
});
