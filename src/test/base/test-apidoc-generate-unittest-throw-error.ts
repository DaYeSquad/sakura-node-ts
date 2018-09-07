// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiDocContext} from "../../util/apidoccontext";
import * as chai from "chai";
import {ApiDoc} from "../../base/apidoc";

class UserController {
  static async getUserInfo(): Promise<void> {}
}

describe("Test API throw KeyPathError", () => {

  it("Test API throw KeyPathError", () => {
    const doc: ApiDoc = {
      groupName: " Dog harry UP",
      descriptions: [
        {
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
          },
          additionalConditions:[
            {
              keyPath:"data/usersss/0/uidd",
              type: "KeyExist"
            }
          ]
        }
      ]
    };
    try {
      chai.expect(() => ApiDocContext.generateUnitTestString({ host: "https://api.gagogroup.cn/api", doc})).throw(ApiDocContext.KeyPathError);
      ApiDocContext.generateUnitTestString({ host: "https://api.gagogroup.cn/api", doc});
    } catch (error) {
      chai.expect(error).instanceOf(ApiDocContext.KeyPathError);
      chai.expect(error.responseBody).equal(doc.descriptions[0].responseBody);
      chai.expect(error.keyPath).equal(doc.descriptions[0].additionalConditions[0].keyPath);
    }
  });
});
