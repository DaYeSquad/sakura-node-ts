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
}

export enum SqlType {
  TEXT,
  VARCHAR,
  INT,
  DATE,
  TIMESTAMP,
  JSON,
  NUMERIC
}

export enum SqlFlag {
  PRIMARY_KEY,
  NOT_NULL,
  NULLABLE
}
