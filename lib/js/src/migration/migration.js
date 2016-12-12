"use strict";
const operation_1 = require('./operation');
const pgclient_1 = require('../database/pgclient');
class Migration {
    constructor() {
        this.operations_ = [];
        this.dependencies_ = [];
    }
    addModel(cls) {
        this.operations_.push(new operation_1.AddModelOperation(cls));
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
    migrate() {
        for (let dependency of this.dependencies_) {
            dependency.migrate();
        }
        let sqls = [];
        for (let operation of this.operations_) {
            sqls.push(operation.sql());
        }
        if (pgclient_1.PgClient.getInstance()) {
            pgclient_1.PgClient.getInstance().queryInTransaction(sqls);
        }
        else {
            throw new Error('UNDEFINED_PG_CLIENT_SHARED_INSTANCE');
        }
    }
}
exports.Migration = Migration;

//# sourceMappingURL=migration.js.map
