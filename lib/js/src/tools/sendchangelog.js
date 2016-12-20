"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Showdown = require('showdown');
const path = require('path');
const fs = require('fs');
const gcs_1 = require('gcs');
function sendChangeLogToDevelopers() {
    return __awaiter(this, void 0, void 0, function* () {
        let lastVersion = undefined;
        const versionFilePath = '/tmp/sakura-node-ts.version';
        if (fs.existsSync(versionFilePath)) {
            lastVersion = fs.readFileSync(versionFilePath, 'utf8');
        }
        const packageJson = require(path.resolve('./package.json'));
        const currentVersion = String(packageJson.version);
        console.log(`Current version is ${currentVersion}, last version is ${lastVersion}`);
        if (currentVersion === lastVersion) {
            return;
        }
        fs.writeFileSync(versionFilePath, packageJson.version, 'utf8');
        const converter = new Showdown.Converter();
        const dataSourceMdPath = path.resolve('./CHANGELOG.md');
        let dataSourceMdContent = fs.readFileSync(dataSourceMdPath, 'utf8');
        dataSourceMdContent = dataSourceMdContent.replace(/\(/g, '（');
        dataSourceMdContent = dataSourceMdContent.replace(/\)/g, '）');
        const dataSourceMarkdownHtml = converter.makeHtml(dataSourceMdContent);
        const toAddresses = ['linxiaoyi@gagogroup.com'];
        const toAddress = toAddresses.join(',');
        const subject = `sakura-node-ts 更新提示 - ${currentVersion}`;
        gcs_1.BaseEmailService.sendHtmlEmail(toAddress, '佳格数据平台', subject, `<html>
        <p><strong>此邮件为机器生成，请勿回复</strong></p>
        ${dataSourceMarkdownHtml}
       </html>`).then((requestId) => {
            console.log(`Send CHANGELOG success ${requestId}`);
        }).catch((error) => {
            console.log(`Send CHANGELOG with error: ${error.message}`);
        });
    });
}
sendChangeLogToDevelopers().then(() => {
    console.log(`sendChangeLogToDevelopers successes`);
}).catch((error) => {
    console.log(`Error ${error}`);
});

//# sourceMappingURL=sendchangelog.js.map
