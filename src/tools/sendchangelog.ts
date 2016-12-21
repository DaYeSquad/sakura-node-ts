// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as path from 'path';
import {BaseEmailService} from 'gcs';

/**
 * 将 CHANGELOG.md 发送给订阅更新邮件的人。
 */

const toAddresses: string[] = ['back@gagogroup.com'];

const packageJson: any = require(path.resolve('./package.json'));
const currentVersion: string = String(packageJson.version);

const changelogPath: string = path.resolve('./CHANGELOG.md');

BaseEmailService.sendChangelog(toAddresses, '基础库更新提示', `sakura ${currentVersion} 更新`, changelogPath,
  '/tmp/sakura-node-ts.version').then((requestId: string) => {
  console.log(`Send CHANGELOG successes ${requestId}`);
}).catch((error) => {
  console.log(`Send CHANGELOG fails ${error.message}`);
});
