"use strict";
const applicationcontext_1 = require("../util/applicationcontext");
const model_1 = require("../base/model");
const dateformatter_1 = require("../util/dateformatter");
class UpdateQuery {
    constructor() {
        this.updates_ = [];
    }
    table(name) {
        this.table_ = name;
        return this;
    }
    tableNameFromClass(cls) {
        let table = applicationcontext_1.applicationContext.findTableByClass(cls);
        if (table) {
            this.table_ = table;
        }
        return this;
    }
    set(key, value) {
        this.updates_.push({ key: key, value: value });
        return this;
    }
    fromModel(model) {
        this.model_ = model;
        let updatesAry = [];
        const sqlDefinitions = applicationcontext_1.applicationContext.findSqlFields(this.model_.constructor);
        for (let sqlField of sqlDefinitions) {
            if (sqlField.flag === model_1.SqlFlag.PRIMARY_KEY) {
            }
            else if (sqlField.name) {
                let key = sqlField.columnName;
                let value = this.model_[sqlField.name];
                if (sqlField.type === model_1.SqlType.VARCHAR || sqlField.type === model_1.SqlType.TEXT) {
                    value = `'${value}'`;
                }
                else if (sqlField.type === model_1.SqlType.DATE) {
                    let valueAsDateInSql = dateformatter_1.DateFormatter.stringFromDate(value, dateformatter_1.DateFormtOption.YEAR_MONTH_DAY, '-');
                    value = `'${valueAsDateInSql}'::date`;
                }
                else if (sqlField.type === model_1.SqlType.TIMESTAMP) {
                    value = `to_timestamp(${value})`;
                }
                updatesAry.push(`${key}=${value}`);
            }
        }
        this.tableNameFromClass(this.model_.constructor);
        this.setValuesSqlFromModel_ = updatesAry.join(',');
        return this;
    }
    where(...args) {
        this.where_ = args.join(' AND ');
        return this;
    }
    build() {
        if (this.model_) {
            return `UPDATE ${this.table_} SET ${this.setValuesSqlFromModel_} WHERE ${this.where_};`;
        }
        else {
            let updatesAry = [];
            this.updates_.forEach((update) => {
                if (typeof (update.value) === 'string') {
                    updatesAry.push(`${update.key}='${update.value}'`);
                }
                else {
                    updatesAry.push(`${update.key}=${update.value}`);
                }
            });
            const updates = updatesAry.join(',');
            return `UPDATE ${this.table_} SET ${updates} WHERE ${this.where_};`;
        }
    }
}
exports.UpdateQuery = UpdateQuery;

//# sourceMappingURL=updatequery.js.map
