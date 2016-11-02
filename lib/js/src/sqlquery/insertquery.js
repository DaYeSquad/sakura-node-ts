"use strict";
const applicationcontext_1 = require("../util/applicationcontext");
const sqlquery_1 = require("./sqlquery");
class InsertQuery {
    constructor() {
        this.returnId_ = true;
    }
    fromModel(model) {
        this.model_ = model;
        return this;
    }
    returnId(b) {
        this.returnId_ = b;
        return this;
    }
    build() {
        if (this.model_) {
            let modelSqlInfo = sqlquery_1.SqlQuery.getSqlInfoFromDefinition(this.model_);
            let primaryKey = modelSqlInfo.primaryKey;
            let keys = modelSqlInfo.keys;
            let values = modelSqlInfo.values;
            const keysStr = keys.join(',');
            const valuesStr = values.join(',');
            const tableName = applicationcontext_1.applicationContext.findTableByClass(this.model_.constructor);
            if (this.returnId_ && primaryKey) {
                return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr}) RETURNING ${primaryKey}`;
            }
            return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr})`;
        }
        return "";
    }
}
exports.InsertQuery = InsertQuery;

//# sourceMappingURL=insertquery.js.map
