"use strict";
const sqlcontext_1 = require("../util/sqlcontext");
class DeleteQuery {
    from(table) {
        this.table_ = table;
        return this;
    }
    fromClass(cls) {
        let table = sqlcontext_1.sqlContext.findTableByClass(cls);
        if (table) {
            this.table_ = table;
        }
        return this;
    }
    where(...args) {
        this.where_ = args.join(' AND ');
        return this;
    }
    build() {
        let sql = `DELETE * FROM ${this.table_}`;
        if (this.where_) {
            sql = `${sql} WHERE ${this.where_}`;
        }
        return sql;
    }
}
exports.DeleteQuery = DeleteQuery;

//# sourceMappingURL=deletequery.js.map
