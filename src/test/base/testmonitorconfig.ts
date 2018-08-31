// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiDocContext, ProjectApiDescription} from "../../util/apidoccontext";
import {ApiDoc} from "../../base/apidoc";
import * as fs from "fs";
import * as chai from "chai";
import * as path from "path";

describe("Test apiDoc to monitor config", () => {

  it("Test apiDoc to monitor config", () => {
    class UserController {
      static login(): void {}
      static getUsers(): void {}
    }

    const doc: ApiDoc = {
      groupName: "user",
      descriptions: [
        {
          function: UserController.login,
          description: "用户登录",
          detailDescription: "用户登录",
          method: "POST",
          uri: "/api/auth/login",
          requestBody: {
            "username": "13021184411",
            "password": "123456"
          },
          responseBody: {
            "data": {
              "token": "318f62f3c422ac4b95c92ba5d051901140439ccb61db92387d3ecc55cdcb15430c962e6cef4a4416891127ecc4cbd5b3",
              "userId": 1,
              "username": "13021184411",
              "displayName": "13021184411",
              "role": "admin",
              "enterpriseId": -1,
              "dataAuthorityId": 2,
              "departments": [
                {
                  "departmentId": 1,
                  "departmentName": "栖霞木村",
                  "haveUsers": true,
                  "parentDepartmentId": null
                }
              ],
              "departmentId": 1,
              "code": 200
            }
          },
          additionalConditions: [
            {
              keyPath: "data/token",
              type: "KeyExist"
            },
            {
              keyPath: "data/userId",
              type: "KeyExist"
            },
            {
              keyPath: "data/username",
              type: "KeyExist"
            },
            {
              keyPath: "data/displayName",
              type: "KeyExist"
            },
            {
              keyPath: "data/departments/0",
              type: "KeyExist"
            },
            {
              keyPath: "data/departments/0/departmentId",
              type: "KeyExist"
            },
            {
              keyPath: "data/departments/0/departmentName",
              type: "KeyExist"
            },
            {
              keyPath: "data/departments/0/parentDepartmentId",
              type: "KeyExist"
            },
            {
              keyPath: "data/departments/departmentId",
              type: "KeyExist"
            }
          ]
        },
        {
          function: UserController.getUsers,
          description: "获取所有用户",
          detailDescription: "获取所有用户",
          method: "GET",
          uri: "/api/auth/users",
          requestHeaders: {
            "token": "f7ce2aae08d917292fb20c8ec4a41ea707bea715f61a89729a77116f3cc9cb6f2a73e1f2e97ebf5cdc384e458b592e4e"
          },
          responseBody: {
            "data": {
              "users": [
                {
                  "userId": 2,
                  "username": "13552785696",
                  "telephone": "13552785696",
                  "displayName": "栖霞木村",
                  "enterpriseId": -1,
                  "departmentId": 1,
                  "dataAuthorityId": 2,
                  "dataAuthorityName": "所在部门及子部门数据",
                  "role": "user",
                  "createdAt": "2018-08-27T05:57:22.000Z"
                }
              ],
              "totalSize": 11,
              "code": 200
            }
          },
          additionalConditions: [
            {
              keyPath: "data/totalSize",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/userId",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/username",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/telephone",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/displayName",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/enterpriseId",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/departmentId",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/dataAuthorityId",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/dataAuthorityName",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/role",
              type: "KeyExist"
            },
            {
              keyPath: "data/users/0/createdAt",
              type: "KeyExist"
            }
          ]
        },
        {
          function: UserController.login,
          description: "修改用户",
          detailDescription: "根据用户 id 来修改用户信息",
          method: "PUT",
          uri: "/api/auth/users/{id}",
          requestHeaders: {
            "token": "f7ce2aae08d917292fb20c8ec4a41ea707bea715f61a89729a77116f3cc9cb6f2a73e1f2e97ebf5cdc384e458b592e4e"
          },
          requestBody: {
            "displayName": "13021184411"
          },
          queryParameters: [
            {
              key: "id",
              example: 1,
              type: "number",
              description: "用户 ID"
            }
          ],
          responseBody: {
            "data": {
              "id": 1,
              "code": 200
            }
          },
        },
        {
          function: UserController.login,
          description: "删除用户",
          detailDescription: "删除用户",
          method: "DELETE",
          uri: "／api/auth/users/{id}",
          requestHeaders: {
            "token": "f7ce2aae08d917292fb20c8ec4a41ea707bea715f61a89729a77116f3cc9cb6f2a73e1f2e97ebf5cdc384e458b592e4e"
          },
          queryParameters: [
            {
              key: "id",
              example: 1,
              type: "number",
              description: "用户 ID"
            }
          ],
          responseBody: {
            "data": {
              "id": 1,
              "code": 200
            }
          }
        },
        {
          function: UserController.login,
          description: "新增用户",
          detailDescription: "新增用户",
          method: "POST",
          uri: "／api/auth/users",
          requestHeaders: {
            "token": "f7ce2aae08d917292fb20c8ec4a41ea707bea715f61a89729a77116f3cc9cb6f2a73e1f2e97ebf5cdc384e458b592e4e"
          },
          requestBody: {
            "displayName": "myname",
            "telephone": "123456789",
            "username": "myname",
            "departmentId": 1,
            "dataAuthorityId": 2
          },
          responseBody: {
            "data": {
              "id": 1,
              "code": 200
            }
          }
        }
      ]
    };

    ApiDocContext.generateMonitorConfig({
      appId: 10086,
      host: "https://dev.gagogroup.cn/api/v4",
      timeInterval: 2,
      outputFilePath: "/tmp/monitor-config.json",
      docs: [doc]
    });

    const expectJson: ProjectApiDescription = require(path.resolve(__dirname, "../../../../../testdata/base/monitor-config.json"));
    const realJson: ProjectApiDescription = require("/tmp/monitor-config.json");
    chai.expect(expectJson.version).to.equal(realJson.version);
    chai.expect(expectJson.appId).to.equal(realJson.appId);
    chai.expect(JSON.stringify(expectJson.apis)).to.equal(JSON.stringify(realJson.apis));
  });
});
