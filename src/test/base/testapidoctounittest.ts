// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {apiDocContext} from "../../util/apidoccontext";
import * as fs from "fs";
import * as chai from "chai";
import {apiDoc} from "../../base/apidoc";

class UserController {
  static async getUserInfo(): Promise<void> {}
}

describe("Test API doc to unit test cases", () => {

  beforeEach(() => {
    apiDocContext.removeAllDocs();
  });

  it("Test generating unit test cases with get-with-queryParameters", () => {
    apiDoc({
      function: UserController.getUserInfo,
      description: "获得所有用户信息",
      detailDescription: "获得所有用户信息，以数组的形式返回",
      method: "GET",
      uri: "/products?pid={pid}",
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

    const expectString: string = fs.readFileSync("testdata/base/fake-test-usercontroller-get-with-queryparameters.txt", "utf8");
    const blueprint: string = apiDocContext.generateUnitTests("https://api.gagogroup.cn/api");
    chai.expect(blueprint).to.equal(expectString);
  });
});
