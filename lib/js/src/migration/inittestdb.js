"use strict";
const fs = require('fs');
const operation_1 = require('./operation');
const sqlcontext_1 = require('../util/sqlcontext');
class InitTestDb {
    constructor() {
        this.operations_ = [];
    }
    initAllTableSql() {
        for (let cls of sqlcontext_1.sqlContext.getTables().keys()) {
            this.operations_.push(new operation_1.AddModelOperation(cls));
        }
    }
    addModel(cls) {
        this.operations_.push(new operation_1.AddModelOperation(cls));
    }
    preview() {
        let sql = '';
        for (let i = 0; i < this.operations_.length; i++) {
            let operation = this.operations_[i];
            sql += operation.sql();
            if (i !== this.operations_.length - 1) {
                sql += '\n';
            }
        }
        return sql;
    }
    save(path = 'sql/test/initTestDb.sql') {
        const sql = this.preview();
        fs.writeFile(path, sql);
    }
}
exports.InitTestDb = InitTestDb;

//# sourceMappingURL=inittestdb.js.map
