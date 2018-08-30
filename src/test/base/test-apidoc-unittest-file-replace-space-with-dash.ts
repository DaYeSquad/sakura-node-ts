// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiDocContext} from "../../util/apidoccontext";
import * as fs from "fs";
import * as chai from "chai";
import {ApiDoc} from "../../base/apidoc";

class UserController {
  static async getUserInfo(): Promise<void> {}
}

describe("Test API doc to unit test replace space with middler line", () => {

  it("Test generating unit test cases file replace space with middler line", () => {
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
          }
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/fake-create-unittest-file-replace-space-with-dash.txt", "utf8");
    ApiDocContext.generateUnitTests({ host: "https://api.gagogroup.cn/api", docs: [doc], path: "/tmp"});

    const expectPath: string = `/tmp/test-dog-harry-up-controller.ts`;
    const realContent: string = fs.readFileSync(expectPath, "utf8");

    chai.expect(realContent).to.equal(expectString);
  });
});
