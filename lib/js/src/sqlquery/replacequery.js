"use strict";
const sqlcontext_1 = require("../util/sqlcontext");
const sqlquery_1 = require("./sqlquery");
class ReplaceQuery {
    constructor() {
        this.newValues_ = [];
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
    set(key, value, sqlType) {
        this.newValues_.push({ key: key, value: value, sqlType: sqlType });
        return this;
    }
    build() {
        let keysAry = [];
        let valuesAry = [];
        let kvsAry = [];
        this.newValues_.forEach((kv) => {
            keysAry.push(kv.key);
            let value = sqlquery_1.SqlQuery.valueAsStringByType(kv.value, kv.sqlType);
            valuesAry.push(value);
            kvsAry.push(`${kv.key}=${value}`);
        });
        let keys = keysAry.join(',');
        let values = valuesAry.join(',');
        let kvs = kvsAry.join(',');
        return `UPDATE ${this.table_} SET ${kvs} WHERE ${this.where_};
            INSERT INTO ${this.table_} (${keys})
            SELECT ${values}
            WHERE NOT EXISTS (SELECT 1 FROM ${this.table_} WHERE ${this.where_});`;
    }
}
exports.ReplaceQuery = ReplaceQuery;

//# sourceMappingURL=replacequery.js.map
