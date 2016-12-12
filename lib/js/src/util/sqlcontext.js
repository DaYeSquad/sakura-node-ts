"use strict";
class SqlContext {
    constructor() {
        this.tables_ = new Map();
        this.sqlDefinitions_ = new Map();
    }
    addSqlTableRelation(relation) {
        this.tables_.set(relation.target, relation.name);
    }
    findTableByClass(cls) {
        return this.tables_.get(cls);
    }
    addSqlField(cls, sqlField) {
        let sqlFields = this.sqlDefinitions_.get(cls);
        if (!sqlFields) {
            this.sqlDefinitions_.set(cls, []);
        }
        this.sqlDefinitions_.get(cls).push(sqlField);
    }
    findSqlFields(cls) {
        return this.sqlDefinitions_.get(cls);
    }
}
exports.SqlContext = SqlContext;
exports.sqlContext = new SqlContext();

//# sourceMappingURL=sqlcontext.js.map
