// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from '../util/sqlcontext';

/**
 * All model object in trustself should inherit from model and declare its table name and sql definition.
 */
export class Model {
  [key: string]: any; // indexer for TypeScript

  /**
   * Makes model instance from row queried by Postgres.
   * @param row Row.
   * @param type Class of T.
   * @returns {T} Model (subclass of Model) instance.
   */
  static modelFromRow<T extends Model>(row: any, type: { new(): T; }): T {
    let sqlFields: Array<SqlField> = sqlContext.findSqlFields(type);
    let instance: T = new type();
    for (let sqlField of sqlFields) {
      instance[sqlField.name] = row[sqlField.columnName];
    }
    return instance;
  }

  /**
   * Returns instances from SQL rows.
   * @param rows SQL rows.
   * @param type Class of T.
   * @returns {Array<T>} Model (subclass of Model) instances.
   */
  static modelsFromRows<T extends Model>(rows: any[], type: { new(): T; }): T[] {
    let instances: Array<T> = [];
    for (let row of rows) {
      instances.push(Model.modelFromRow(row, type));
    }
    return instances;
  }
}

/**
 * Wrapper of sql definition.
 */
export interface SqlField {
  name?: string; // field name of model
  type: SqlType; // column type in table
  flag: SqlFlag; // flag to indicate some special thing
  columnName?: string; // column name in table
  defaultValue?: SqlDefaultValue; // default value of sql
  comment?: string; // comment of field
}

/**
 * Sql Type.
 */
export enum SqlType {
  TEXT,
  VARCHAR_255, // VARCHAR(255)
  VARCHAR_1024, // VARCHAR(2014)
  INT,
  DATE,
  TIMESTAMP,
  JSON,
  NUMERIC,
  BOOLEAN
}

/**
 * Sql flag indicates the key.
 */
export enum SqlFlag {
  PRIMARY_KEY,
  NOT_NULL,
  NULLABLE
}

/**
 * Sql default value type.
 */
export enum SqlDefaultValueType {
  MAKE_RANDOM_ID,
  NUMBER,
  SERIAL
}

/**
 * Default value of sql.
 */
export class SqlDefaultValue {
  type: SqlDefaultValueType;
  private value_: any;

  /**
   * Default value type INTEGER and value is random ID.
   * @constructor
   */
  static MAKE_RANDOM_ID(): SqlDefaultValue {
    let sqlDefaultValue: SqlDefaultValue = new SqlDefaultValue();
    sqlDefaultValue.type = SqlDefaultValueType.MAKE_RANDOM_ID;
    return sqlDefaultValue;
  };

  /**
   * Default value type INTEGER and value is auto increment integer.
   * @constructor
   */
  static SERIAL(): SqlDefaultValue {
    let sqlDefaultValue: SqlDefaultValue = new SqlDefaultValue();
    sqlDefaultValue.type = SqlDefaultValueType.SERIAL;
    return sqlDefaultValue;
  }

  /**
   * Default value type INTEGER, FLOAT or other numeric value and value is specific number.
   * @constructor
   */
  static NUMBER(num: number): SqlDefaultValue {
    let sqlDefaultValue: SqlDefaultValue = new SqlDefaultValue();
    sqlDefaultValue.type = SqlDefaultValueType.NUMBER;
    sqlDefaultValue.value_ = num;
    return sqlDefaultValue;
  }
}
