"use strict";
const sqlcontext_1 = require('../util/sqlcontext');
class SelectQuery {
    constructor() {
        this.orderBys_ = [];
        this.joinUsings_ = [];
    }
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
    fromTable(table) {
        this.table_ = table;
        return this;
    }
    joinUsing(joninStr) {
        this.joinUsings_.push(joninStr);
        return this;
    }
    select(fields = []) {
        this.selectFields_ = fields;
        return this;
    }
    where(...args) {
        this.where_ = args.join(' AND ');
        return this;
    }
    orderBy(sort, order = 'ASC') {
        this.orderBys_.push({ sort: sort, order: order });
        return this;
    }
    setLimit(limit) {
        this.limit_ = limit;
        return this;
    }
    setOffset(offset) {
        this.offset_ = offset;
        return this;
    }
    build() {
        let fields = '*';
        if (this.selectFields_.length > 0) {
            fields = this.selectFields_.join(',');
        }
        let sql = `SELECT ${fields} FROM ${this.table_}`;
        if (this.joinUsings_.length > 0) {
            for (let joinUsing of this.joinUsings_) {
                sql = `${sql} ${joinUsing} `;
            }
        }
        if (this.where_) {
            sql = `${sql} WHERE ${this.where_}`;
        }
        if (this.orderBys_.length > 0) {
            let orderBySqls = [];
            for (let orderBy of this.orderBys_) {
                orderBySqls.push(`${orderBy.sort} ${orderBy.order}`);
            }
            let orderBySql = orderBySqls.join(',');
            sql = `${sql} ORDER BY ${orderBySql}`;
        }
        if (this.limit_) {
            sql = `${sql} LIMIT ${this.limit_}`;
        }
        if (this.offset_) {
            if (this.offset_ >= 0) {
                sql = `${sql} OFFSET ${this.offset_}`;
            }
        }
        return sql;
    }
}
exports.SelectQuery = SelectQuery;

//# sourceMappingURL=selectquery.js.map
