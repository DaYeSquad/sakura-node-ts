"use strict";
const applicationcontext_1 = require("../util/applicationcontext");
class Model {
    static modelFromRow(row, type) {
        let sqlFields = applicationcontext_1.applicationContext.findSqlFields(type);
        let instance = new type();
        for (let sqlField of sqlFields) {
            instance[sqlField.name] = row[sqlField.columnName];
        }
        return instance;
    }
}
exports.Model = Model;
(function (SqlType) {
    SqlType[SqlType["TEXT"] = 0] = "TEXT";
    SqlType[SqlType["VARCHAR"] = 1] = "VARCHAR";
    SqlType[SqlType["INT"] = 2] = "INT";
    SqlType[SqlType["DATE"] = 3] = "DATE";
    SqlType[SqlType["TIMESTAMP"] = 4] = "TIMESTAMP";
    SqlType[SqlType["JSON"] = 5] = "JSON";
})(exports.SqlType || (exports.SqlType = {}));
var SqlType = exports.SqlType;
(function (SqlFlag) {
    SqlFlag[SqlFlag["PRIMARY_KEY"] = 0] = "PRIMARY_KEY";
    SqlFlag[SqlFlag["NOT_NULL"] = 1] = "NOT_NULL";
    SqlFlag[SqlFlag["NULLABLE"] = 2] = "NULLABLE";
})(exports.SqlFlag || (exports.SqlFlag = {}));
var SqlFlag = exports.SqlFlag;

//# sourceMappingURL=model.js.map
