// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Field} from "./column";
import {SqlType} from "../../base/model";

export enum OperationType {
  ADD_MODEL,
  ADD_COMMENT,
  ADD_COLUMN,
  DROP_COLUMN,
  RENAME_COLUMN,
  CHANGE_COLUMN_TYPE,
}

/**
 * Base operation.
 */
export abstract class Operation {
  modelClass: Function;
  abstract type: OperationType;
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
  type: OperationType = OperationType.ADD_MODEL;

  constructor(cls: Function) {
    super();
    this.modelClass = cls;
  }
}

/**
 * Adds comment operation.
 */
export class AddCommentOperation extends ModelOperation {
  type: OperationType = OperationType.ADD_COMMENT;

  constructor(cls: Function) {
    super();
    this.modelClass = cls;
  }
}

/**
 * Adds column operation aka ALTER TABLE ... ADD COLUMN.
 */
export class AddColumnOperation extends ColumnOperation {
  type: OperationType = OperationType.ADD_COLUMN;

  column: Field;

  constructor(cls: Function, column: Field) {
    super();
    this.modelClass = cls;
    this.column = column;
  }
}

/**
 * Drop column operation aka ALTER TABLE ... DROP COLUMN IF EXISTS.
 */
export class DropColumnOperation extends ColumnOperation {
  type: OperationType = OperationType.DROP_COLUMN;
  columnName: string;

  constructor(cls: Function, name: string) {
    super();
    this.modelClass = cls;
    this.columnName = name;
  }
}

/**
 * Rename column operation aka ALTER TABLE ... DROP COLUMN IF EXISTS.
 */
export class RenameColumnOperation extends ColumnOperation {
  type: OperationType = OperationType.RENAME_COLUMN;

  oldName: string;
  newName: string;

  constructor(cls: Function, oldName: string, newName: string) {
    super();
    this.modelClass = cls;
    this.oldName = oldName;
    this.newName = newName;
  }
}

/**
 * Change column type operation aka ALTER TABLE ... ALTER TYPE
 */
export class ChangeColumnTypeOperation extends ColumnOperation {
  type: OperationType = OperationType.CHANGE_COLUMN_TYPE;

  columnName: string;
  newType: SqlType;

  constructor(cls: Function, columnName: string, newType: SqlType) {
    super();
    this.modelClass = cls;
    this.columnName = columnName;
    this.newType = newType;
  }
}
