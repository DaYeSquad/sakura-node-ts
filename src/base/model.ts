// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";
import {DateUtil} from "../util/dateutil";

export type ModelClass<T> = { new(): T; };

/**
 * All model object should inherit from model and declare its table name and sql definition.
 */
export class Model {
  [key: string]: any; // indexer for TypeScript

  /**
   * Makes multiple  model instance from row queried by Postgres.
   * @param row Row.
   * @param typeA  Class of model
   * @param typeB Class of model
   * @returns {T & U} Model (subclass of Model) instance.
   */
  static compositeModelFromRow<T extends Model, U extends Model>(row: any, typeA: ModelClass<T>, typeB: ModelClass<U>): T & U;
  static compositeModelFromRow<T extends Model, U extends Model, V extends Model>(row: any, typeA: ModelClass<T>, typeB: ModelClass<U>, typeC: ModelClass<V>): T & U & V;
  static compositeModelFromRow(row: any, ...types: { new(): any; }[]): any {
    let instance: any = {};
    for (let type of types) {
      let t: any = Model.modelFromRow(row, type);
      instance = Object.assign(instance, t);
    }
    return instance;
  }

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
      if (sqlField.type === SqlType.TIMESTAMP) {
        instance[sqlField.name] = DateUtil.millisecondToTimestamp(new Date(row[sqlField.columnName]).getTime());
      } else if (sqlField.type === SqlType.JSON) {
        if (typeof row[sqlField.columnName] === "string") {
          instance[sqlField.name] = JSON.parse(row[sqlField.columnName]);
        } else if (typeof row[sqlField.columnName] === "object") {
          instance[sqlField.name] = row[sqlField.columnName];
        } else {
          // Null
          instance[sqlField.name] = undefined;
        }
      } else if (sqlField.type === SqlType.INT || sqlField.type === SqlType.BIGINT || sqlField.type === SqlType.NUMERIC) {
        if (row[sqlField.columnName] === null) {
          instance[sqlField.name] = null;
        } else {
          instance[sqlField.name] = Number(row[sqlField.columnName]);
        }
      } else {
        instance[sqlField.name] = row[sqlField.columnName];
      }
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
  BIGINT,
  DATE,
  TIMESTAMP,
  TIMESTAMP_WITH_TIMEZONE,
  JSON,
  NUMERIC,
  BOOLEAN,
  GEOMETRY
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
  SERIAL,
  UUID
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

  /**
   * Default value type VARCHAR_255 and value is UUID
   * @constructor
   */
  static UUID(version: number = 4): SqlDefaultValue {
    let sqlDefaultValue: SqlDefaultValue = new SqlDefaultValue();
    sqlDefaultValue.type = SqlDefaultValueType.UUID;
    sqlDefaultValue.value_ = version;
    return sqlDefaultValue;
  }
}
