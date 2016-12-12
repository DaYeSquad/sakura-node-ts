"use strict";
const fs = require('fs');
class PgClientConfig {
    constructor(filePath) {
        const configJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        this.user = configJson['user'];
        this.password = configJson['password'];
        this.datebase = configJson['database'];
        this.host = configJson['host'];
        this.port = configJson['port'];
    }
}
exports.PgClientConfig = PgClientConfig;

//# sourceMappingURL=pgclientconfig.js.map
