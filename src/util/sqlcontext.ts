// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import { SqlField, SqlFlag } from "../base/model";

/**
 * Application context for some metadata storage.
 */
export class SqlContext {
  private tables_: Map<Function, string> = new Map();
  private sqlDefinitions_: Map<Function, Array<SqlField>> = new Map();

  /**
   * Adds sql relationship, used by decorators.
   * @param relation Sql table name and class name.
   */
  addSqlTableRelation(relation: SqlTableRelation): void {
    this.tables_.set(relation.target, relation.name);
  }

  /**
   * Gets table name by class name.
   * @param cls Class name.
   * @returns {string} Table name.
   */
  findTableByClass(cls: Function): string {
    return this.tables_.get(cls);
  }

  /**
   * Adds sql field description, used by decorators.
   * @param cls Class.
   * @param sqlField Sql field.
   */
  addSqlField(cls: Function, sqlField: SqlField): void {
    let sqlFields: Array<SqlField> = this.sqlDefinitions_.get(cls);
    if (!sqlFields) {
      this.sqlDefinitions_.set(cls, []);
    }
    this.sqlDefinitions_.get(cls).push(sqlField);
  }

  getTables(): Map<Function, string> {
    return this.tables_;
  }

  /**
   * Gets sql field description by Class.
   * @param cls Class.
   * @returns {Array<SqlField>} Definition of the class.
   */
  findSqlFields(cls: Function): SqlField[] {
    return this.sqlDefinitions_.get(cls);
  }

  /**
   * Gets the field name of the primary key in Class.
   * @param cls Class.
   * @returns {Array<SqlField>} the field name of the primary key, if it is existed, or it will return undefined.
   */
  findPrimaryKeyByClass(cls: Function): string | undefined {
    const definitions = this.sqlDefinitions_.get(cls);
    if (!definitions) {
      return undefined;
    }

    for (let definition of definitions) {
      if (definition.flag === SqlFlag.PRIMARY_KEY) {
        return definition.columnName;
      }
    }
  }
}

/**
 * SqlTable and model relationship, used as decorators.
 */
export interface SqlTableRelation {
  target: Function; // class
  name: string; // table name
}

export let sqlContext = new SqlContext();
