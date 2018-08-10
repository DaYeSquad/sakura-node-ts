// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";
import {apiDoc} from "../../base/apidoc";
import {apiDocContext} from "../../util/apidoccontext";
import * as fs from "fs";

class UserController {
  static async getUserInfo(): Promise<void> {}
}

describe("Test API doc decorator", () => {

  beforeEach(() => {
    apiDocContext.removeAllDocs();
  });

  it("Test API doc decorator with GET request with parameters", () => {
    apiDoc({
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
    });

    const expectString: string = fs.readFileSync("testdata/base/api-get-with-queryparameters.md", "utf8");
    const blueprint: string = apiDocContext.generateBlueprintDocument();
    chai.expect(blueprint).to.equal(expectString);
  });

  it("Test API doc decorator with GET request without parameters", () => {
    apiDoc({
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
    });

    const expectString: string = fs.readFileSync("testdata/base/api-get-without-queryparameters.md", "utf8");
    const blueprint: string = apiDocContext.generateBlueprintDocument();
    chai.expect(blueprint).to.equal(expectString);
  });
});
