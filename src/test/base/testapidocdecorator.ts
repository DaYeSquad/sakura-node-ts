// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";
import * as fs from "fs";
import {ApiDoc} from "../../base/apidoc";
import {ApiDocContext} from "../../util/apidoccontext";

class UserController {
  static async getUserInfo(): Promise<void> {}
}

describe("Test API doc decorator", () => {

  it("Test API doc decorator with GET request with parameters", () => {
    const doc: ApiDoc = {
      groupName: "Monitor",
      descriptions: [
        {
          function: UserController.getUserInfo,
          description: "获得所有用户信息",
          detailDescription: "获得所有用户信息，以数组的形式返回",
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
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/api-get-with-queryparameters.md", "utf8");
    const blueprint: string = ApiDocContext.generateBlueprintDocument({host: "https://api.gagogroup.cn/api", docs: [doc]});
    chai.expect(blueprint).to.equal(expectString);
  });

  it("Test API doc decorator with GET request without parameters", () => {
    const doc: ApiDoc = {
      groupName: "Monitor",
      descriptions: [
        {
          function: UserController.getUserInfo,
          description: "获得所有用户信息",
          detailDescription: "获得所有用户信息，以数组的形式返回",
          method: "GET",
          uri: "/products",
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

    const expectString: string = fs.readFileSync("testdata/base/api-get-without-queryparameters.md", "utf8");
    const blueprint: string = ApiDocContext.generateBlueprintDocument({host: "https://api.gagogroup.cn/api", docs: [doc]});
    chai.expect(blueprint).to.equal(expectString);
  });

  it("Test API doc decorator with DELETE request with parameters", () => {
    const doc: ApiDoc = {
      groupName: "Monitor",
      descriptions: [
        {
          function: UserController.getUserInfo,
          description: "删除所有用户信息",
          method: "DELETE",
          uri: "/products/{pid}",
          queryParameters: [
            {
              key: "pid",
              example: 15,
              type: "number",
              description: "产品 ID"
            }
          ],
          requestHeaders: {
            "Token": "it-is-a-token"
          },
          responseBody: {
            "data": {
              "message": "ok"
            }
          }
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/api-delete-with-queryparameters.md", "utf8");
    const blueprint: string = ApiDocContext.generateBlueprintDocument({host: "https://api.gagogroup.cn/api", docs: [doc]});
    chai.expect(blueprint).to.equal(expectString);
  });

  it("Test API doc decorator with POST request with body and parameters", () => {
    const doc: ApiDoc = {
      groupName: "Monitor",
      descriptions: [
        {
          function: UserController.getUserInfo,
          description: "新增所有用户信息",
          method: "POST",
          uri: "/products/{pid}",
          queryParameters: [
            {
              key: "pid",
              example: 15,
              type: "number",
              description: "产品 ID"
            }
          ],
          requestHeaders: {
            "Token": "it-is-a-token"
          },
          requestBody: {
            "username": "linxiaoyi",
            "displayName": "lindaxian"
          },
          responseBody: {
            "data": {
              "message": "ok"
            }
          }
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/api-post-with-queryparameters-body.md", "utf8");
    const blueprint: string = ApiDocContext.generateBlueprintDocument({host: "https://api.gagogroup.cn/api", docs: [doc]});
    chai.expect(blueprint).to.equal(expectString);
  });

  it("Test API doc decorator with POST request with body and parameters", () => {
    const doc: ApiDoc = {
      groupName: "Monitor",
      descriptions: [
        {
          function: UserController.getUserInfo,
          description: "新增所有用户信息",
          method: "POST",
          uri: "/products/{pid}",
          queryParameters: [
            {
              key: "pid",
              example: 15,
              type: "number",
              description: "产品 ID"
            }
          ],
          requestHeaders: {
            "Token": "it-is-a-token"
          },
          requestBody: {
            "username": "linxiaoyi",
            "displayName": "lindaxian"
          },
          responseBody: {
            "data": {
              "message": "ok"
            }
          }
        },
        {
          function: UserController.getUserInfo,
          description: "删除所有用户信息",
          method: "DELETE",
          uri: "/products/{pid}",
          queryParameters: [
            {
              key: "pid",
              example: 15,
              type: "number",
              description: "产品 ID"
            }
          ],
          requestHeaders: {
            "Token": "it-is-a-token"
          },
          responseBody: {
            "data": {
              "message": "ok"
            }
          }
        }
      ]
    };

    const expectString: string = fs.readFileSync("testdata/base/api-multiple-docs.md", "utf8");
    const blueprint: string = ApiDocContext.generateBlueprintDocument({host: "https://api.gagogroup.cn/api", docs: [doc]});
    chai.expect(blueprint).to.equal(expectString);
  });
});
