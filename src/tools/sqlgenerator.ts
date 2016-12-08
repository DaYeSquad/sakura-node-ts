// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from '../util/sqlcontext';
import {SqlField, SqlType, SqlFlag, SqlDefaultValue, SqlDefaultValueType} from '../base/model';

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

    let sql: string = `CREATE TABLE ${tableName} (\n`;

    const sqlFields: SqlField[] = sqlContext.findSqlFields(cls);
    sqlFields.forEach((sqlField: SqlField, index: number) => {
      const type: string = this.sqlTypeToCreateSyntaxString_(sqlField.type);
      const flag: string = this.sqlFlagToCreateSyntaxString_(sqlField.flag);
      let flagWithWhiteSpace: string = '';
      if (flag !== '') {
        flagWithWhiteSpace = ` ${flag}`;
      }

      let defaultValueWithWhiteSpace: string = '';
      if (sqlField.defaultValue) {
        defaultValueWithWhiteSpace = ` DEFAULT ${this.sqlDefaultValueToCreateSyntaxString_(sqlField.defaultValue)}`;
      }

      let comment: string = '';
      if (sqlField.comment) {
        comment = ` --${sqlField.comment}`;
      }

      let comma: string = index === (sqlFields.length - 1) ? '' : ',';

      sql += `${sqlField.columnName} ${type}${flagWithWhiteSpace}${defaultValueWithWhiteSpace}${comma}${comment}\n`;
    });

    sql += `);`;
    return sql;
  }

  /**
   * Translate SqlType to string used in CREATE TABLE syntax.
   * eg: SqlType.INT will be translated to 'INTEGER'.
   * @private
   */
  private sqlTypeToCreateSyntaxString_(sqlType: SqlType): string {
    switch (sqlType) {
      case SqlType.INT: return 'INTEGER';
      case SqlType.VARCHAR_1024: return 'VARCHAR(1024)';
      case SqlType.VARCHAR_255: return 'VARCHAR(255)';
      case SqlType.TIMESTAMP: return 'TIMESTAMP';
      case SqlType.JSON: return 'JSON';
      case SqlType.NUMERIC: return 'NUMERIC';
      case SqlType.DATE: return 'DATE';
      default: throw Error('Undefined SqlType');
    }
  }

  /**
   * Translate SqlFlag to string used in CREATE TABLE syntax.
   * eg: SqlFlag.PRIMARY_KEY will be translated to 'PRIMARY KEY'.
   * @private
   */
  private sqlFlagToCreateSyntaxString_(sqlFlag: SqlFlag): string {
    if (sqlFlag === SqlFlag.PRIMARY_KEY) {
      return 'PRIMARY KEY';
    }
    return '';
  }

  /**
   * Translate SqlDefaultValue to string used in CREATE TABLE syntax.
   * eg: SqlDefaultValueType.MAKE_RANDOM_ID will be translated to 'make_random_id'.
   * @private
   */
  private sqlDefaultValueToCreateSyntaxString_(sqlDefaultValue: SqlDefaultValue): string {
    if (sqlDefaultValue.type === SqlDefaultValueType.MAKE_RANDOM_ID) {
      return 'make_random_id()';
    }
    return '';
  }
}

export let sqlGenerator = new SqlGenerator();
