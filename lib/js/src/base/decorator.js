"use strict";
const model_1 = require("./model");
const applicationcontext_1 = require("../util/applicationcontext");
function TableName(name) {
    return function (target) {
        if (target.prototype instanceof model_1.Model) {
            applicationcontext_1.applicationContext.addSqlTableRelation({ target: target, name: name });
        }
    };
}
exports.TableName = TableName;
function Column(name, type, flag) {
    return function (target, propertyName) {
        if (target instanceof model_1.Model) {
            applicationcontext_1.applicationContext.addSqlField(target.constructor, { name: propertyName, columnName: name, type: type, flag: flag });
        }
    };
}
exports.Column = Column;

//# sourceMappingURL=decorator.js.map
