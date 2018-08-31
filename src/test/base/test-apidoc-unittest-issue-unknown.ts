// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiDoc} from "../../base/apidoc";
import {ApiDocContext} from "../../util/apidoccontext";
import * as chai from "chai";
import * as fs from "fs";

class Farmrecordcontroller {
  static getAllFarmrecordsByQuery(): void {}
}

const doc: ApiDoc = {
  groupName: "farm-record",
  descriptions: [
    {
      function: Farmrecordcontroller.getAllFarmrecordsByQuery,
      description: "获取所有农事记录",
      detailDescription: "获取所有农事记录",
      queryParameters: [
        {
          key: "department",
          example: 8,
          type: "number",
          description: "option，部门 id，0 和不带任何变量为显示有权限的所有部门"
        },
        {
          key: "enterprise",
          example: 1,
          type: "number",
          description: "option，企业 id，不带为显示用户所属企业"
        },
        {
          key: "query",
          example: "下雨",
          type: "string",
          description: "option，模糊查询用户名或备注"
        },
        {
          key: "start",
          example: "2018-08-01",
          type: "string",
          description: "option，农事时间在 start 以后的时间"
        },
        {
          key: "end",
          example: "2018-10-01",
          type: "string",
          description: "option，农事时间在 end 以后的时间"
        },
        {
          key: "sort_type",
          example: "ASC",
          type: "string",
          description: "option，default 是 DESC，只接受 asc, desc 两个"
        },
      ],
      method: "GET",
      uri: "/api/farmrecord/all",
      requestHeaders: {
        "token": "eccb7dff5d52a0bf20906be10abb4b6d57fd3f84f29c19b90f423d1e9c32479efb27e2137a1b44627dff7c1ca59f0c89"
      },
      responseBody: {
        "data": {
          "farmrecords": [
            {
              "id": 445,
              "recordLatitude": 37.20937100428181,
              "recordLongitude": 120.63112306813393,
              "recordText": "",
              "recordAudioUrl": "https://gago-data.oss-cn-beijing.aliyuncs.com/agri3/14-0.0015465769743243651-iat.mp3",
              "recordAudioLen": 12,
              "recordPictureUrls": [
                "https://gago-data.oss-cn-beijing.aliyuncs.com/agri3/14-0.0015465769743243651-1535414232000.jpg",
                "https://gago-data.oss-cn-beijing.aliyuncs.com/agri3/14-0.0015465769743243651-1535414232287.jpg",
                "https://gago-data.oss-cn-beijing.aliyuncs.com/agri3/14-0.0015465769743243651-1535414232152.jpg"
              ],
              "userName": "栖霞木村",
              "userId": 14,
              "updatedAt": "2018-08-28T06:09:21.000Z"
            }
          ],
          "code": 200
        }
      },
      additionalConditions: [
        {
          keyPath: "data/farmrecords/0/id",
          type: "KeyExist"
        },
        {
          keyPath: "data/farmrecords/0/recordLatitude",
          type: "KeyExist"
        },
        {
          keyPath: "data/farmrecords/0/recordLongitude",
          type: "KeyExist"
        },
        {
          keyPath: "data/farmrecords/0/recordText",
          type: "KeyExist"
        },
        {
          keyPath: "data/farmrecords/0/recordAudioLen",
          type: "KeyExist"
        },
        {
          keyPath: "data/farmrecords/0/recordPictureUrls/0",
          type: "KeyExist"
        },
        {
          keyPath: "data/farmrecords/0/recordPictureUrls/1",
          type: "KeyExist"
        },
        {
          keyPath: "data/farmrecords/0/userName",
          type: "KeyExist"
        },
        {
          keyPath: "data/farmrecords/0/userId",
          type: "KeyExist"
        },
        {
          keyPath: "data/farmrecords/0/updatedAt",
          type: "KeyExist"
        }
      ]
    }
  ]
};

describe("Test genreating unittest issue whose", () => {
  it("Test genreating unittest issue", () => {
    const expectString: string = fs.readFileSync("testdata/base/issue-02.txt", "utf8");
    ApiDocContext.generateUnitTests({ host: "https://api.gagogroup.cn/api", docs: [doc], path: "/tmp"});

    const expectPath: string = `/tmp/test-farm-record-controller.ts`;
    const realContent: string = fs.readFileSync(expectPath, "utf8");

    chai.expect(realContent).to.equal(expectString);
  });
});
