// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as Showdown from 'showdown';
import * as path from 'path';
import * as fs from 'fs';
import {BaseEmailService} from 'gcs';

/**
 * 将 CHANGELOG.md 发送给订阅更新邮件的人。
 */
async function sendChangeLogToDevelopers() {
  // 将当前 package.json 中的 version 写入 /tmp/gago-data.version
  let lastVersion: string | undefined = undefined;

  const versionFilePath: string = '/tmp/sakura-node-ts.version';
  if (fs.existsSync(versionFilePath)) {
    lastVersion = fs.readFileSync(versionFilePath, 'utf8');
  }

  const packageJson: any = require(path.resolve('./package.json'));
  const currentVersion: string = String(packageJson.version);

  console.log(`Current version is ${currentVersion}, last version is ${lastVersion}`);

  if (currentVersion === lastVersion) { // 如果版本与上一个部署的版本一致则不发送邮件
    return;
  }

  fs.writeFileSync(versionFilePath, packageJson.version, 'utf8');

  // 发送 CHANGELOG.md
  const converter: Showdown.Converter = new Showdown.Converter();
  const dataSourceMdPath: string = path.resolve('./CHANGELOG.md');
  let dataSourceMdContent: string = fs.readFileSync(dataSourceMdPath, 'utf8');

  dataSourceMdContent = dataSourceMdContent.replace(/\(/g, '（');
  dataSourceMdContent = dataSourceMdContent.replace(/\)/g, '）');

  const dataSourceMarkdownHtml: string = converter.makeHtml(dataSourceMdContent);

  // 发送邮件给后端团队
  const toAddresses: string[] = ['back@gagogroup.com'];
  const toAddress: string = toAddresses.join(',');

  const subject: string = `sakura-node-ts 更新提示 - ${currentVersion}`;

  BaseEmailService.sendHtmlEmail(toAddress, '佳格数据平台', subject,
    `<html>
        <p><strong>此邮件为机器生成，请勿回复</strong></p>
        ${dataSourceMarkdownHtml}
       </html>`).then((requestId: string) => {
    console.log(`Send CHANGELOG success ${requestId}`);
  }).catch((error: any) => {
    console.log(`Send CHANGELOG with error: ${error.message}`);
  });
}

sendChangeLogToDevelopers().then(() => {
  console.log(`sendChangeLogToDevelopers successes`);
}).catch((error) => {
  console.log(`Error ${error}`);
});
