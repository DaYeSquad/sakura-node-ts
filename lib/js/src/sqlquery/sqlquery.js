"use strict";
const model_1 = require('../base/model');
const sqlcontext_1 = require('../util/sqlcontext');
const dateformatter_1 = require('../util/dateformatter');
class SqlQuery {
    static getSqlInfoFromDefinition(model) {
        let modelInfo = { primaryKey: '', keys: [], values: [] };
        const sqlDefinitions = sqlcontext_1.sqlContext.findSqlFields(model.constructor);
        for (let sqlField of sqlDefinitions) {
            if (sqlField.flag === model_1.SqlFlag.PRIMARY_KEY) {
                modelInfo.primaryKey = sqlField.columnName;
            }
            else if (sqlField.name) {
                if (model[sqlField.name]) {
                    modelInfo.keys.push(sqlField.columnName);
                    let value = model[sqlField.name];
                    value = SqlQuery.valueAsStringByType(value, sqlField.type);
                    modelInfo.values.push(value);
                }
            }
        }
        return modelInfo;
    }
    static valueAsStringByType(value, sqlType) {
        if (sqlType === model_1.SqlType.VARCHAR_255 || sqlType === model_1.SqlType.TEXT || sqlType === model_1.SqlType.VARCHAR_1024) {
            value = `'${value}'`;
        }
        else if (sqlType === model_1.SqlType.DATE) {
            let valueAsDateInSql = dateformatter_1.DateFormatter.stringFromDate(value, dateformatter_1.DateFormtOption.YEAR_MONTH_DAY, '-');
            value = `'${valueAsDateInSql}'::date`;
        }
        else if (sqlType === model_1.SqlType.TIMESTAMP) {
            value = `to_timestamp(${value})`;
        }
        else if (sqlType === model_1.SqlType.JSON) {
            if (typeof value === 'string') {
                value = `'${value}'::json`;
            }
            else {
                value = `'${JSON.stringify(value)}'::json`;
            }
        }
        return value;
    }
}
exports.SqlQuery = SqlQuery;

//# sourceMappingURL=sqlquery.js.map
