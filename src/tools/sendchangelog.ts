// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as path from "path";
import {BaseEmailService} from "gago-cloud-service";
import {Aliyun, AliyunConfigOptions} from "gago-cloud-service";
import {logError, logInfo} from "../util/logger";

/**
 * 将 CHANGELOG.md 发送给订阅更新邮件的人。
 */

if (process.env["NODE_ENV"] !== "test") {
  // enable email service
  let aliuyunConfig: AliyunConfigOptions = {
    enterpriseId: process.env["ENTERPRISE_ID"],
    accessId: process.env["ACCESS_ID"],
    accessSecret: process.env["ACCESS_SECRET"],
    ossRegion: process.env["OSS_REGION"]
  };
  Aliyun.setConfig(aliuyunConfig);

  // send email
  const toAddresses: string[] = ["linxiaoyi@gagogroup.com", "jiangwei@gagogroup.com", "tangyongtao@gagogroup.com",
    "huangtaihu@gagogroup.com", "libiyang@gagogroup.com", "cuixiangchang@gagogroup.com", "jialongfei@gagogroup.com",
    "gaoqiang@gagogroup.com", "wuenping@gagogroup.com", "wanghui@gagogroup.com", "qiaolei@gagogroup.com",
    "yangdonglai@gagogroup.com"];

  const packageJson: any = require(path.resolve("./package.json"));
  const currentVersion: string = String(packageJson.version);

  const changelogPath: string = path.resolve("./CHANGELOG.md");

  BaseEmailService.sendChangelog(toAddresses, "基础库更新提示", `sakura ${currentVersion} 更新`, changelogPath,
    "/tmp/sakura-node-ts.version").then((requestId: string) => {
    logInfo(`Send CHANGELOG successes ${requestId}`);
  }).catch((error) => {
    logError(`Send CHANGELOG fails ${error.message}`);
  });
}
