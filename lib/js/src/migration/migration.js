"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require('fs');
const path = require('path');
const operation_1 = require('./operation');
const pgclient_1 = require('../database/pgclient');
const selectquery_1 = require('../sqlquery/selectquery');
const version_1 = require('./version');
const insertquery_1 = require('../sqlquery/insertquery');
class Migration {
    constructor(version) {
        this.version_ = 0;
        this.pgInstance_ = undefined;
        this.operations_ = [];
        this.dependencies_ = [];
        this.version_ = version;
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
    currentVersion_() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = new selectquery_1.SelectQuery().fromClass(version_1.Version).select().build();
            const result = yield this.pgInstance_.query(sql);
            if (result.rows.length > 0) {
                return result.rows[0]['version'];
            }
            else {
                return undefined;
            }
        });
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
    save(path) {
        const sql = this.preview();
        fs.writeFile(path, sql);
    }
    migrate(setupEnv = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (pgclient_1.PgClient.getInstance()) {
                this.pgInstance_ = pgclient_1.PgClient.getInstance();
            }
            else {
                throw new Error('UNDEFINED_PG_CLIENT_SHARED_INSTANCE');
            }
            const currentVersion = yield this.currentVersion_();
            if (currentVersion === undefined) {
                this.addModel(version_1.Version);
                let version = new version_1.Version();
                version.version = this.version_;
                const sql = new insertquery_1.InsertQuery().fromModel(version).build();
                yield this.pgInstance_.query(sql);
            }
            else if (this.version_ === currentVersion) {
                return;
            }
            for (let dependency of this.dependencies_) {
                yield dependency.migrate();
            }
            let sqls = [];
            if (setupEnv) {
                let setupEnvSql = fs.readFileSync(path.resolve('sql/setup_pg.sql'), 'utf8') + '\n';
                sqls.push(setupEnvSql);
            }
            for (let operation of this.operations_) {
                sqls.push(operation.sql());
            }
            yield this.pgInstance_.queryInTransaction(sqls);
        });
    }
}
exports.Migration = Migration;

//# sourceMappingURL=migration.js.map
