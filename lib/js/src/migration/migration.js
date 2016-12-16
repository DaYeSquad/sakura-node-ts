"use strict";
const fs = require('fs');
const path = require('path');
const operation_1 = require('./operation');
const pgclient_1 = require('../database/pgclient');
class Migration {
    constructor() {
        this.operations_ = [];
        this.dependencies_ = [];
    }
    addModel(cls) {
        this.operations_.push(new operation_1.AddModelOperation(cls));
        this.operations_.push(new operation_1.InitCommentOperation(cls));
    }
    addColumn(cls, column) {
        this.operations_.push(new operation_1.AddColumnOperation(cls, column));
    }
    dropColumn(cls, columnName) {
        this.operations_.push(new operation_1.DropColumnOperation(cls, columnName));
    }
    renameColumn(cls, oldName, newName) {
        this.operations_.push(new operation_1.RenameColumnOperation(cls, oldName, newName));
    }
    addDependency(dependency) {
        this.dependencies_.push(dependency);
    }
    setDependencies(dependencies) {
        this.dependencies_ = dependencies;
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
    save(path = 'sql/migration.sql') {
        const sql = this.preview();
        fs.writeFile(path, sql);
    }
    migrate(setupEnv = false) {
        let pgClient = undefined;
        if (pgclient_1.PgClient.getInstance()) {
            pgClient = pgclient_1.PgClient.getInstance();
        }
        else {
            throw new Error('UNDEFINED_PG_CLIENT_SHARED_INSTANCE');
        }
        for (let dependency of this.dependencies_) {
            dependency.migrate();
        }
        let sqls = [];
        if (setupEnv) {
            let setupEnvSql = fs.readFileSync(path.resolve('sql/setup_pg.sql'), 'utf8') + '\n';
            sqls.push(setupEnvSql);
        }
        for (let operation of this.operations_) {
            sqls.push(operation.sql());
        }
        pgClient.queryInTransaction(sqls);
    }
}
exports.Migration = Migration;

//# sourceMappingURL=migration.js.map
