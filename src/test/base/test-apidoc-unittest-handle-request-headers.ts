// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiDocContext} from "../../util/apidoccontext";
import * as fs from "fs";
import * as chai from "chai";
import {ApiDoc} from "../../base/apidoc";

class UserController {
  static async getUserInfo(): Promise<void> {}
}

describe("Test API doc unit test handle request headers right", () => {

  it("judge content-type from apidoc", () => {
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
          requestHeaders: {
            "content-type": "application/pdf"
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
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/apidoc-unittest-judge-content-type-header.txt", "utf8");
    const outputString = ApiDocContext.generateUnitTestString({ host: "https://api.gagogroup.cn/api", doc});
    chai.expect(outputString).to.equal(expectString);
  });


  it("judge Content-Type from apidoc", () => {
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
          requestHeaders: {
            "Content-Type": "application/pdf"
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
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/apidoc-unittest-judge-camel-content-type-header.txt", "utf8");
    const outputString = ApiDocContext.generateUnitTestString({ host: "https://api.gagogroup.cn/api", doc});
    chai.expect(outputString).to.equal(expectString);
  });
});
