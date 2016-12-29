"use strict";
const path = require("path");
const gcs_1 = require("gcs");
const toAddresses = ['linxiaoyi@gagogroup.com', 'jiangwei@gagogroup.com', 'huteng@gagogroup.com',
    'liqiushuai@gagogroup.com'];
const packageJson = require(path.resolve('./package.json'));
const currentVersion = String(packageJson.version);
const changelogPath = path.resolve('./CHANGELOG.md');
gcs_1.BaseEmailService.sendChangelog(toAddresses, '基础库更新提示', `sakura ${currentVersion} 更新`, changelogPath, '/tmp/sakura-node-ts.version').then((requestId) => {
    console.log(`Send CHANGELOG successes ${requestId}`);
}).catch((error) => {
    console.log(`Send CHANGELOG fails ${error.message}`);
});

//# sourceMappingURL=sendchangelog.js.map
