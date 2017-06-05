// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Field} from "./column";
import {sqlGenerator} from "../tools/sqlgenerator";
import {SqlType} from "../base/model";

/**
 * Base operation.
 */
export abstract class Operation {
  protected modelClass_: Function;
  abstract sql(): string;
}

/**
 * Model operation or table operation.
 */
export abstract class ModelOperation extends Operation {
}

/**
 * Column operation or field operation.
 */
export abstract class ColumnOperation extends Operation {
}

/**
 * Adds model operation aka CREATE TABLE.
 */
export class AddModelOperation extends ModelOperation {
  constructor(cls: Function) {
    super();
    this.modelClass_ = cls;
  }

  sql(): string {
    return sqlGenerator.generateCreateTableSql(this.modelClass_);
  }
}

// export class AddTestModelOperation extends ModelOperation {
//   constructor(cls: Function) {
//     super();
//     this.modelClass_ = cls;
//   }
//
//   sql(): string {
//     return testSqlGenerator.generateCreateTableSql(this.modelClass_);
//   }
// }

export class InitCommentOperation extends ModelOperation {
  constructor(cls: Function) {
    super();
    this.modelClass_ = cls;
  }

  sql(): string {
    return sqlGenerator.generateColumnCommentAction(this.modelClass_);
  }
}

/**
 * Adds column operation aka ALTER TABLE ... ADD COLUMN.
 */
export class AddColumnOperation extends ColumnOperation {
  private column_: Field;

  constructor(cls: Function, column: Field) {
    super();
    this.modelClass_ = cls;
    this.column_ = column;
  }

  sql(): string {
    return sqlGenerator.generateAlertTableWithAddColumnAction(this.modelClass_, this.column_);
  }
}

/**
 * Drop column operation aka ALTER TABLE ... DROP COLUMN IF EXISTS.
 */
export class DropColumnOperation extends ColumnOperation {
  private name_: string;

  constructor(cls: Function, name: string) {
    super();
    this.modelClass_ = cls;
    this.name_ = name;
  }

  sql(): string {
    return sqlGenerator.generateAlertTableWithDropColumnAction(this.modelClass_, this.name_);
  }
}

/**
 * Rename column operation aka ALTER TABLE ... DROP COLUMN IF EXISTS.
 */
export class RenameColumnOperation extends ColumnOperation {
  private oldName_: string;
  private newName_: string;

  constructor(cls: Function, oldName: string, newName: string) {
    super();
    this.modelClass_ = cls;
    this.oldName_ = oldName;
    this.newName_ = newName;
  }

  sql(): string {
    return sqlGenerator.generateAlterTableWithRenameColumnAction(this.modelClass_, this.oldName_, this.newName_);
  }
}

/**
 * Renset column type operation aka ALTER TABLE ... ALTER TYPE
 */
export class ResetColumnTypeOperation extends ColumnOperation {
  private columnName_: string;
  private newType_: SqlType;

  constructor(cls: Function, columnName: string, newType: SqlType) {
    super();
    this.modelClass_ = cls;
    this.columnName_ = columnName;
    this.newType_ = newType;
  }

  sql(): string {
    return sqlGenerator.generateAlterTableWithAlterColumnTypeAction(this.modelClass_, this.columnName_, this.newType_);
  }
}
