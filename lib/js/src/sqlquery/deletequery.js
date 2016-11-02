"use strict";
const applicationcontext_1 = require("../util/applicationcontext");
class DeleteQuery {
    from(table) {
        this.table_ = table;
        return this;
    }
    fromClass(cls) {
        let table = applicationcontext_1.applicationContext.findTableByClass(cls);
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
