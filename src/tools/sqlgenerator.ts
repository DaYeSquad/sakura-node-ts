// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";
import {SqlField, SqlType, SqlFlag, SqlDefaultValue, SqlDefaultValueType} from "../base/model";
import {Field} from "../migration/column";

/**
 * Used to generate sql file with validation by model.
 */
export class SqlGenerator {

  /**
   * Generates CREATE TABLE sql by given model.
   * @param cls Subclass of Model.
   * @returns {string} Sql.
   */
  generateCreateTableSql(cls: Function): string {
    const tableName: string = sqlContext.findTableByClass(cls);

    let sql: string = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

    const sqlFields: SqlField[] = sqlContext.findSqlFields(cls);
    sqlFields.forEach((sqlField: SqlField, index: number) => {
      const type: string = this.sqlTypeToCreateSyntaxString_(sqlField.type);
      const flag: string = this.sqlFlagToCreateSyntaxString_(sqlField.flag);
      let flagWithWhiteSpace: string = "";
      if (flag !== "") {
        flagWithWhiteSpace = ` ${flag}`;
      }

      let comment: string = "";
      if (sqlField.comment) {
        comment = ` --${sqlField.comment}`;
      }

      let comma: string = index === (sqlFields.length - 1) ? "" : ",";

      let defaultValueWithWhiteSpace: string = "";
      if (sqlField.defaultValue) {
        // if default value type is SERIAL, use SERIAL syntax
        if (sqlField.defaultValue.type === SqlDefaultValueType.SERIAL) {
          sql += `${sqlField.columnName} SERIAL${comma}${comment}\n`;
          return;
        }

        defaultValueWithWhiteSpace = ` DEFAULT ${this.sqlDefaultValueToCreateSyntaxString_(sqlField.defaultValue)}`;
      }

      sql += `${sqlField.columnName} ${type}${flagWithWhiteSpace}${defaultValueWithWhiteSpace}${comma}${comment}\n`;
    });

    sql += `);`;
    return sql;
  }

  /**
   * Generates ALERT TABLE with ADD COLUMN sql.
   * @param cls Subclass of Model.
   * @param column Column description.
   * @returns {string} sql
   */
  generateAlertTableWithAddColumnAction(cls: Function, column: Field): string {
    const tableName: string = sqlContext.findTableByClass(cls);
    const type: string = this.sqlTypeToCreateSyntaxString_(column.type);

    let defaultValueWithWhiteSpace: string = "";
    if (column.defaultValue) {
      defaultValueWithWhiteSpace = ` DEFAULT ${this.sqlDefaultValueToCreateSyntaxString_(column.defaultValue)}`;
    }

    return `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${type}${defaultValueWithWhiteSpace};`;
  }

  /**
   * Generates ALERT TABLE with DROP COLUMN sql.
   * @param cls Subclass of Model.
   * @param columnName Column name.
   * @returns {string} sql
   */
  generateAlertTableWithDropColumnAction(cls: Function, columnName: string): string {
    const tableName: string = sqlContext.findTableByClass(cls);
    return `ALTER TABLE ${tableName} DROP COLUMN IF EXISTS ${columnName};`;
  }

  /**
   * Generates ALERT TABLE with RENAME COLUMN sql.
   * @param cls Subclass of Model.
   * @param oldName Old column name.
   * @param newName New column name.
   * @returns {string} sql
   */
  generateAlertTableWithRenameColumnAction(cls: Function, oldName: string, newName: string): string {
    const tableName: string = sqlContext.findTableByClass(cls);
    return `ALTER TABLE ${tableName} RENAME COLUMN ${oldName} TO ${newName};`;
  }

  generateColumnCommentAction(cls: Function): string {
    let sql: string = "";
    const tableName: string = sqlContext.findTableByClass(cls);
    const sqlFields: SqlField[] = sqlContext.findSqlFields(cls);
    for (let sqlField of sqlFields){
      if (sqlField.comment) {
        sql += `COMMENT ON COLUMN ${tableName}.${sqlField.columnName} IS "${sqlField.comment}";\n`;
      }
    }

    return sql;
  }

  /**
   * Translate SqlType to string used in CREATE TABLE syntax.
   * eg: SqlType.INT will be translated to "INTEGER".
   * @private
   */
  private sqlTypeToCreateSyntaxString_(sqlType: SqlType): string {
    switch (sqlType) {
      case SqlType.INT: return "INTEGER";
      case SqlType.VARCHAR_1024: return "VARCHAR(1024)";
      case SqlType.VARCHAR_255: return "VARCHAR(255)";
      case SqlType.TIMESTAMP: return "TIMESTAMP";
      case SqlType.JSON: return "JSON";
      case SqlType.NUMERIC: return "NUMERIC";
      case SqlType.DATE: return "DATE";
      case SqlType.TEXT: return "TEXT";
      case SqlType.BOOLEAN: return "BOOLEAN";
      default: throw Error(`Undefined SqlType ${sqlType}`);
    }
  }

  /**
   * Translate SqlFlag to string used in CREATE TABLE syntax.
   * eg: SqlFlag.PRIMARY_KEY will be translated to "PRIMARY KEY".
   * @private
   */
  private sqlFlagToCreateSyntaxString_(sqlFlag: SqlFlag): string {
    if (sqlFlag === SqlFlag.PRIMARY_KEY) {
      return "PRIMARY KEY";
    }
    return "";
  }

  /**
   * Translate SqlDefaultValue to string used in CREATE TABLE syntax.
   * eg: SqlDefaultValueType.MAKE_RANDOM_ID will be translated to "make_random_id".
   * @private
   */
  private sqlDefaultValueToCreateSyntaxString_(sqlDefaultValue: SqlDefaultValue): string {
    if (sqlDefaultValue.type === SqlDefaultValueType.MAKE_RANDOM_ID) {
      return "make_random_id()";
    }
    return "";
  }
}

export let sqlGenerator = new SqlGenerator();
