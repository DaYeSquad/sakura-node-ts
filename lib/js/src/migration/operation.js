"use strict";
const sqlgenerator_1 = require('../tools/sqlgenerator');
class Operation {
}
exports.Operation = Operation;
class ModelOperation extends Operation {
}
exports.ModelOperation = ModelOperation;
class ColumnOperation extends Operation {
}
exports.ColumnOperation = ColumnOperation;
class AddModelOperation extends ModelOperation {
    constructor(cls) {
        super();
        this.modelClass_ = cls;
    }
    sql() {
        return sqlgenerator_1.sqlGenerator.generateCreateTableSql(this.modelClass_);
    }
}
exports.AddModelOperation = AddModelOperation;
class InitCommentOperation extends ModelOperation {
    constructor(cls) {
        super();
        this.modelClass_ = cls;
    }
    sql() {
        return sqlgenerator_1.sqlGenerator.generateColumnCommentAction(this.modelClass_);
    }
}
exports.InitCommentOperation = InitCommentOperation;
class AddColumnOperation extends ColumnOperation {
    constructor(cls, column) {
        super();
        this.modelClass_ = cls;
        this.column_ = column;
    }
    sql() {
        return sqlgenerator_1.sqlGenerator.generateAlertTableWithAddColumnAction(this.modelClass_, this.column_);
    }
}
exports.AddColumnOperation = AddColumnOperation;
class DropColumnOperation extends ColumnOperation {
    constructor(cls, name) {
        super();
        this.modelClass_ = cls;
        this.name_ = name;
    }
    sql() {
        return sqlgenerator_1.sqlGenerator.generateAlertTableWithDropColumnAction(this.modelClass_, this.name_);
    }
}
exports.DropColumnOperation = DropColumnOperation;
class RenameColumnOperation extends ColumnOperation {
    constructor(cls, oldName, newName) {
        super();
        this.modelClass_ = cls;
        this.oldName_ = oldName;
        this.newName_ = newName;
    }
    sql() {
        return sqlgenerator_1.sqlGenerator.generateAlertTableWithRenameColumnAction(this.modelClass_, this.oldName_, this.newName_);
    }
}
exports.RenameColumnOperation = RenameColumnOperation;

//# sourceMappingURL=operation.js.map
