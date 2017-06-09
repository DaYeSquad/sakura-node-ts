// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as util from "util";

import {QueryBuilder} from "../querybuilder";
import {SelectQuery} from "../../sqlquery/selectquery";
import {DeleteQuery} from "../../sqlquery/deletequery";
import {InsertQuery} from "../../sqlquery/insertquery";
import {ModelSqlInfo, SqlQuery} from "../../sqlquery/sqlquery";
import {sqlContext} from "../../util/sqlcontext";
import {UpdateQuery} from "../../sqlquery/updatequery";
import {ReplaceQuery} from "../../sqlquery/replacequery";
import {
  AddColumnOperation, AddCommentOperation, AddModelOperation, ChangeColumnTypeOperation, DropColumnOperation,
  RenameColumnOperation
} from "../migration/operation";
import {SqlDefaultValue, SqlDefaultValueType, SqlField, SqlFlag, SqlType} from "../../base/model";

/**
 * MySQL query builder.
 */
export class MySqlQueryBuilder implements QueryBuilder {

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

    // join tableName on
    if (q.joinOn_.length > 0) {
      for (let eachJoinOn of q.joinOn_) {
        sql = `${sql} JOIN ${eachJoinOn.tableName} ON (${eachJoinOn["on"]})`;
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
        return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr}); SELECT last_insert_id();`;
      }

      return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr})`;
    }
    return "";
  }

  buildUpdateQuery(q: UpdateQuery): string {
    // TODO(lin.xiaoe.f@gmail.com): add update query implementation
    return "";
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
   * Builds {AddModelOperation} to raw query.
   * @param operation {AddModelOperation} object.
   */
  buildAddModelOperation(operation: AddModelOperation): string {
    const tableName: string = sqlContext.findTableByClass(operation.modelClass);

    let sql: string = util.format("CREATE TABLE IF NOT EXISTS `%s` (\n", tableName);
    let primaryKey: string | undefined = undefined;

    const sqlFields: SqlField[] = sqlContext.findSqlFields(operation.modelClass);
    sqlFields.forEach((sqlField: SqlField, index: number) => {
      const type: string = this.sqlTypeToCreateSyntaxString_(sqlField.type);

      if (sqlField.flag === SqlFlag.PRIMARY_KEY) {
        primaryKey = util.format("PRIMARY KEY (`%s`)", sqlField.columnName);
      }

      let comment: string = "";
      if (sqlField.comment) {
        comment = ` COMMENT '${sqlField.comment}'`;
      }

      let comma: string = index === (sqlFields.length - 1) ? "" : ",";

      let defaultValueWithWhiteSpace: string = "";
      if (sqlField.defaultValue) {
        // if default value type is SERIAL, use SERIAL syntax
        if (sqlField.defaultValue.type === SqlDefaultValueType.SERIAL) {
          sql += `${sqlField.columnName} INT AUTO_INCREMENT${comment}${comma}\n`;
          return;
        }

        defaultValueWithWhiteSpace = ` DEFAULT ${this.sqlDefaultValueToCreateSyntaxString_(sqlField.defaultValue)}`;
      }

      sql += `\`${sqlField.columnName}\` ${type}${defaultValueWithWhiteSpace}${comment}${comma}\n`;
    });

    if (primaryKey) {
      sql += `,\n${primaryKey}`;
    }

    sql += `);`;
    return sql;
  }


  /**
   * Implemented in {buildAddModelOperation}.
   */
  buildAddCommentOperation(operation: AddCommentOperation): string | undefined {
    return undefined;
  }

  /**
   * Builds {AddColumnOperation} to raw query.
   * @param op {AddColumnOperation} object.
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
   * Builds {DropColumnOperation} to raw query.
   * @param op {DropColumnOperation} object.
   */
  buildDropColumnOperation(op: DropColumnOperation): string {
    const tableName: string = sqlContext.findTableByClass(op.modelClass);
    return `ALTER TABLE ${tableName} DROP COLUMN ${op.columnName};`;
  }

  /**
   * Builds {RenameColumnOperation} to raw query.
   * @param op {RenameColumnOperation} object.
   */
  buildRenameColumnOperation(op: RenameColumnOperation): string {
    const tableName: string = sqlContext.findTableByClass(op.modelClass);
    const sqlFields: SqlField[] = sqlContext.findSqlFields(op.modelClass);
    let sqlType: SqlType | undefined;
    for (let sqlField of sqlFields) {
      if (sqlField.name === op.oldName) {
        sqlType = sqlField.type;
        break;
      }
    }
    const type: string = this.sqlTypeToCreateSyntaxString_(sqlType);
    return `ALTER TABLE ${tableName} CHANGE ${op.oldName} ${op.newName} ${type};`;
  }

  /**
   * Builds {ChangeColumnTypeOperation} to raw query.
   * @param op {ChangeColumnTypeOperation} object.
   */
  buildChangeColumnTypeOperation(op: ChangeColumnTypeOperation): string {
    const tableName: string = sqlContext.findTableByClass(op.modelClass);
    const newTypeInString: string = this.sqlTypeToCreateSyntaxString_(op.newType);
    return `ALTER TABLE ${tableName} MODIFY ${op.columnName} ${newTypeInString};`;
  }

  /**
   * Translate SqlType to string used in CREATE TABLE syntax.
   * eg: SqlType.INT will be translated to "INTEGER".
   * @private
   */
  private sqlTypeToCreateSyntaxString_(sqlType: SqlType): string {
    switch (sqlType) {
      case SqlType.INT: return "INT";
      case SqlType.BIGINT: return "BIGINT";
      case SqlType.VARCHAR_1024: return "VARCHAR(1024)";
      case SqlType.VARCHAR_255: return "VARCHAR(255)";
      case SqlType.TIMESTAMP: return "TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
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