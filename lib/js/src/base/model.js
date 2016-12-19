"use strict";
const sqlcontext_1 = require('../util/sqlcontext');
class Model {
    static modelFromRow(row, type) {
        let sqlFields = sqlcontext_1.sqlContext.findSqlFields(type);
        let instance = new type();
        for (let sqlField of sqlFields) {
            instance[sqlField.name] = row[sqlField.columnName];
        }
        return instance;
    }
    static modelsFromRows(rows, type) {
        let instances = [];
        for (let row of rows) {
            instances.push(Model.modelFromRow(row, type));
        }
        return instances;
    }
}
exports.Model = Model;
(function (SqlType) {
    SqlType[SqlType["TEXT"] = 0] = "TEXT";
    SqlType[SqlType["VARCHAR_255"] = 1] = "VARCHAR_255";
    SqlType[SqlType["VARCHAR_1024"] = 2] = "VARCHAR_1024";
    SqlType[SqlType["INT"] = 3] = "INT";
    SqlType[SqlType["DATE"] = 4] = "DATE";
    SqlType[SqlType["TIMESTAMP"] = 5] = "TIMESTAMP";
    SqlType[SqlType["JSON"] = 6] = "JSON";
    SqlType[SqlType["NUMERIC"] = 7] = "NUMERIC";
    SqlType[SqlType["BOOLEAN"] = 8] = "BOOLEAN";
})(exports.SqlType || (exports.SqlType = {}));
var SqlType = exports.SqlType;
(function (SqlFlag) {
    SqlFlag[SqlFlag["PRIMARY_KEY"] = 0] = "PRIMARY_KEY";
    SqlFlag[SqlFlag["NOT_NULL"] = 1] = "NOT_NULL";
    SqlFlag[SqlFlag["NULLABLE"] = 2] = "NULLABLE";
})(exports.SqlFlag || (exports.SqlFlag = {}));
var SqlFlag = exports.SqlFlag;
(function (SqlDefaultValueType) {
    SqlDefaultValueType[SqlDefaultValueType["MAKE_RANDOM_ID"] = 0] = "MAKE_RANDOM_ID";
    SqlDefaultValueType[SqlDefaultValueType["NUMBER"] = 1] = "NUMBER";
    SqlDefaultValueType[SqlDefaultValueType["SERIAL"] = 2] = "SERIAL";
})(exports.SqlDefaultValueType || (exports.SqlDefaultValueType = {}));
var SqlDefaultValueType = exports.SqlDefaultValueType;
class SqlDefaultValue {
    static MAKE_RANDOM_ID() {
        let sqlDefaultValue = new SqlDefaultValue();
        sqlDefaultValue.type = SqlDefaultValueType.MAKE_RANDOM_ID;
        return sqlDefaultValue;
    }
    ;
    static SERIAL() {
        let sqlDefaultValue = new SqlDefaultValue();
        sqlDefaultValue.type = SqlDefaultValueType.SERIAL;
        return sqlDefaultValue;
    }
    static NUMBER(num) {
        let sqlDefaultValue = new SqlDefaultValue();
        sqlDefaultValue.type = SqlDefaultValueType.NUMBER;
        sqlDefaultValue.value_ = num;
        return sqlDefaultValue;
    }
}
exports.SqlDefaultValue = SqlDefaultValue;

//# sourceMappingURL=model.js.map
