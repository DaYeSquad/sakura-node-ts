"use strict";
const model_1 = require("./model");
const sqlcontext_1 = require("../util/sqlcontext");
function TableName(name) {
    return function (target) {
        if (target.prototype instanceof model_1.Model) {
            sqlcontext_1.sqlContext.addSqlTableRelation({ target: target, name: name });
        }
    };
}
exports.TableName = TableName;
function Column(name, type, flag) {
    return function (target, propertyName) {
        if (target instanceof model_1.Model) {
            sqlcontext_1.sqlContext.addSqlField(target.constructor, { name: propertyName, columnName: name, type: type, flag: flag });
        }
    };
}
exports.Column = Column;

//# sourceMappingURL=decorator.js.map
