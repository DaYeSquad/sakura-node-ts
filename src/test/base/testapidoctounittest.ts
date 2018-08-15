// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiDocContext} from "../../util/apidoccontext";
import * as fs from "fs";
import * as chai from "chai";
import {ApiDoc} from "../../base/apidoc";

class UserController {
  static async getUserInfo(): Promise<void> {}
}

describe("Test API doc to unit test cases", () => {

  it("Test generating unit test cases with get-with-queryParameters", () => {
    const doc: ApiDoc = {
      groupName: "Monitor",
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
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/fake-test-usercontroller-get-with-queryparameters.txt", "utf8");
    ApiDocContext.generateUnitTests({ host: "https://api.gagogroup.cn/api", docs: [doc], path: "/tmp"});

    const expectPath: string = `/tmp/test-monitor-controller.ts`;
    const realContent: string = fs.readFileSync(expectPath, "utf8");

    chai.expect(realContent).to.equal(expectString);
  });

  it("Test generating unit test cases with conditions which is an object", () => {
    const doc: ApiDoc = {
      groupName: "Monitor",
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
            "Token": "it-is-a-token"
          },
          responseBody: {
            "data": {
              "user": {
                "uid": 1,
                "displayName": "linxiaoyi"
              }
            }
          },
          additionalConditions: [
            {
              keyPath: "data/user/uid",
              type: "KeyExist"
            }
          ]
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/fake-test-usercontroller-with-conditions.txt", "utf8");
    ApiDocContext.generateUnitTests({ host: "https://api.gagogroup.cn/api", docs: [doc], path: "/tmp"});

    const expectPath: string = `/tmp/test-monitor-controller.ts`;
    const realContent: string = fs.readFileSync(expectPath, "utf8");

    chai.expect(realContent).to.equal(expectString);
  });

  it("Test generating unit test cases with conditions which is an array", () => {
    const doc: ApiDoc = {
      groupName: "Monitor",
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
          },
          additionalConditions: [
            {
              keyPath: "data/users/0/uid",
              type: "KeyExist"
            }
          ]
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/fake-test-usercontroller-with-conditions-array.txt", "utf8");
    ApiDocContext.generateUnitTests({ host: "https://api.gagogroup.cn/api", docs: [doc], path: "/tmp"});

    const expectPath: string = `/tmp/test-monitor-controller.ts`;
    const realContent: string = fs.readFileSync(expectPath, "utf8");

    chai.expect(realContent).to.equal(expectString);
  });
});
