// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {QueryBuilder} from "../querybuilder";
import {SelectQuery} from "../../sqlquery/selectquery";
import {DeleteQuery} from "../../sqlquery/deletequery";
import {InsertQuery} from "../../sqlquery/insertquery";
import {ModelSqlInfo, SqlQuery} from "../../sqlquery/sqlquery";
import {sqlContext} from "../../util/sqlcontext";
import {UpdateQuery} from "../../sqlquery/updatequery";
import {ReplaceQuery} from "../../sqlquery/replacequery";
import {SqlDefaultValue, SqlDefaultValueType, SqlField, SqlFlag, SqlType} from "../../base/model";
import {DateFormatter, DateFormtOption} from "../../util/dateformatter";
import {isDate, isNumber} from "util";
import {
  AddColumnOperation, AddCommentOperation, AddModelOperation, ChangeColumnTypeOperation, DropColumnOperation,
  RenameColumnOperation
} from "../migration/operation";

/**
 * PostgreSQL query builder.
 */
export class PgQueryBuilder implements QueryBuilder {

  buildSelectQuery(q: SelectQuery): string {
    let fields: string = "*";
    if (q.selectFields_.length > 0) {
      fields = q.selectFields_.join(",");
    }

    let sql: string = `SELECT ${fields} FROM ${q.table_}`;

    // join tableName using(column)
    if (q.joinUsings_.length > 0) {
      for (let joinUsing of q.joinUsings_) {
        sql = `${sql} ${joinUsing} `;
      }
    }

    // WHERE
    if (q.where_) {
      sql = `${sql} WHERE ${q.where_}`;
    }

    // GROUP
    if (q.groupBy_.length > 0) {
      let groupBySqls: Array<string> = [];
      for (let groupBy of q.groupBy_) {
        groupBySqls.push(`${groupBy}`);
      }
      let groupBySql = groupBySqls.join(",");
      sql = `${sql} GROUP BY ${groupBySql}`;
    }

    // ORDER BY
    if (q.orderBys_.length > 0) {
      let orderBySqls: Array<string> = [];
      for (let orderBy of q.orderBys_) {
        orderBySqls.push(`${orderBy.sort} ${orderBy.order}`);
      }
      let orderBySql = orderBySqls.join(",");
      sql = `${sql} ORDER BY ${orderBySql}`;
    }

    // LIMIT
    if (q.limit_) {
      sql = `${sql} LIMIT ${q.limit_}`;
    }

    // OFFSET
    if (q.offset_) {
      if (q.offset_ >= 0) {
        sql = `${sql} OFFSET ${q.offset_}`;
      }
    }

    return sql;
  }

  buildDeleteQuery(q: DeleteQuery): string {
    let sql: string = `DELETE FROM ${q.table_}`;
    if (q.where_) {
      sql = `${sql} WHERE ${q.where_}`;
    }
    return sql;
  }

  buildInsertQuery(q: InsertQuery): string {
    if (q.model_) {
      let modelSqlInfo: ModelSqlInfo = SqlQuery.getSqlInfoFromDefinition(q.model_);

      let primaryKey: string = modelSqlInfo.primaryKey;
      let keys: Array<string> = modelSqlInfo.keys;
      let values: Array<string> = modelSqlInfo.values;

      const keysStr: string = keys.join(",");
      const valuesStr: string = values.join(",");

      const tableName: string = sqlContext.findTableByClass(q.model_.constructor);

      if (q.returnId_ && primaryKey) {
        return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr}) RETURNING ${primaryKey}`;
      }

      return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr})`;
    }
    return "";
  }

  buildUpdateQuery(q: UpdateQuery): string {
    if (q.model_) {
      let updatesAry: string[] = [];
      const sqlDefinitions: Array<SqlField> = sqlContext.findSqlFields(q.model_.constructor);

      for (let sqlField of sqlDefinitions) {
        if (sqlField.flag === SqlFlag.PRIMARY_KEY) {
          // default ignore primary key to keys array
        } else if (sqlField.name) {
          let key: string = sqlField.columnName;
          let value: any = q.model_[sqlField.name];
          if (value !== undefined) {
            if (sqlField.type === SqlType.VARCHAR_255 || sqlField.type === SqlType.TEXT || sqlField.type === SqlType.VARCHAR_1024) {
              value = `'${value}'`;
            } else if (sqlField.type === SqlType.DATE) {
              let valueAsDateInSql: string = DateFormatter.stringFromDate(value, DateFormtOption.YEAR_MONTH_DAY, "-");
              value = `'${valueAsDateInSql}'::date`;
            } else if (sqlField.type === SqlType.TIMESTAMP) {
              if (isNumber(value)) {
                value = `to_timestamp(${value})`;
              } else if (isDate(value)) {
                let tmp = Math.floor(new Date(value).getTime() / 1000);
                value = `to_timestamp(${tmp})`;
              }
            } else if (sqlField.type === SqlType.JSON) {
              if (typeof value === "string") {
                value = `${value}::json`;
              } else {
                value = `'${JSON.stringify(value)}'::json`;
              }
            }
            updatesAry.push(`${key}=${value}`);
          }
        }
      }

      q.tableNameFromClass(q.model_.constructor);
      q.setValuesSqlFromModel_ = updatesAry.join(",");

      return `UPDATE ${q.table_} SET ${q.setValuesSqlFromModel_} WHERE ${q.where_};`;
    } else {
      let updatesAry: string[] = [];
      q.updates_.forEach((update: {key: string, value: any}) => {
        if (typeof(update.value) === "string") {
          updatesAry.push(`${update.key}='${update.value}'`);
        } else {
          updatesAry.push(`${update.key}=${update.value}`);
        }
      });

      const updates: string = updatesAry.join(",");
      return `UPDATE ${q.table_} SET ${updates} WHERE ${q.where_};`;
    }
  }

  buildReplaceQuery(q: ReplaceQuery): string {
    let keysAry: string[] = [];
    let valuesAry: any[] = [];
    let kvsAry: any[] = [];

    q.newValues_.forEach((kv) => {
      keysAry.push(kv.key);

      let value: string = SqlQuery.valueAsStringByType(kv.value, kv.sqlType);
      valuesAry.push(value);
      kvsAry.push(`${kv.key}=${value}`);
    });

    let keys: string = keysAry.join(",");
    let values: string = valuesAry.join(",");
    let kvs: string = kvsAry.join(",");

    return `UPDATE ${q.table_} SET ${kvs} WHERE ${q.where_};
            INSERT INTO ${q.table_} (${keys})
            SELECT ${values}
            WHERE NOT EXISTS (SELECT 1 FROM ${q.table_} WHERE ${q.where_});`;
  }

  /**
   * CREATE TABLE IF NOT EXISTS <table_name> ...;
   */
  buildAddModelOperation(operation: AddModelOperation): string {
    const cls: Function = operation.modelClass;
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
   * COMMENT ON COLUMN <col> IS '<comment>';
   */
  buildAddCommentOperation(op: AddCommentOperation): string {
    let sql: string = "";
    const tableName: string = sqlContext.findTableByClass(op.modelClass);
    const sqlFields: SqlField[] = sqlContext.findSqlFields(op.modelClass);
    for (let sqlField of sqlFields){
      if (sqlField.comment) {
        sql += `COMMENT ON COLUMN ${tableName}.${sqlField.columnName} IS '${sqlField.comment}';\n`;
      }
    }

    return sql;
  }

  /**
   * ALERT TABLE with ADD COLUMN sql.
   */
  buildAddColumnOperation(op: AddColumnOperation): string {
    const tableName: string = sqlContext.findTableByClass(op.modelClass);
    const type: string = this.sqlTypeToCreateSyntaxString_(op.column.type);

    let defaultValueWithWhiteSpace: string = "";
    if (op.column.defaultValue) {
      defaultValueWithWhiteSpace = ` DEFAULT ${this.sqlDefaultValueToCreateSyntaxString_(op.column.defaultValue)}`;
    }

    return `ALTER TABLE ${tableName} ADD COLUMN ${op.column.name} ${type}${defaultValueWithWhiteSpace};`;
  }

  /**
   * ALERT TABLE with DROP COLUMN sql
   */
  buildDropColumnOperation(op: DropColumnOperation): string {
    const tableName: string = sqlContext.findTableByClass(op.modelClass);
    return `ALTER TABLE ${tableName} DROP COLUMN IF EXISTS ${op.columnName};`;
  }

  /**
   * ALERT TABLE with RENAME COLUMN sql.
   */
  buildRenameColumnOperation(op: RenameColumnOperation): string {
    const tableName: string = sqlContext.findTableByClass(op.modelClass);
    return `ALTER TABLE ${tableName} RENAME COLUMN ${op.oldName} TO ${op.newName};`;
  }

  /**
   * ALERT TABLE reset COLUMN type sql.
   */
  buildChangeColumnTypeOperation(op: ChangeColumnTypeOperation): string {
    const tableName: string = sqlContext.findTableByClass(op.modelClass);
    const newTypeInString: string = this.sqlTypeToCreateSyntaxString_(op.newType);
    return `ALTER TABLE ${tableName} ALTER ${op.columnName} TYPE ${newTypeInString};`;
  }

  /**
   * Translate SqlType to string used in CREATE TABLE syntax.
   * eg: SqlType.INT will be translated to "INTEGER".
   * @private
   */
  private sqlTypeToCreateSyntaxString_(sqlType: SqlType): string {
    switch (sqlType) {
      case SqlType.INT: return "INTEGER";
      case SqlType.BIGINT: return "BIGINT";
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