// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as uuid from "uuid";

import {QueryBuilder} from "../querybuilder";
import {SelectQuery, JoinType} from "../../sqlquery/selectquery";
import {DeleteQuery} from "../../sqlquery/deletequery";
import {InsertQuery} from "../../sqlquery/insertquery";
import {ModelSqlInfo} from "../querybuilder";
import {sqlContext} from "../../util/sqlcontext";
import {UpdateQuery} from "../../sqlquery/updatequery";
import {ReplaceQuery} from "../../sqlquery/replacequery";
import {SqlDefaultValue, SqlDefaultValueType, SqlField, SqlFlag, SqlType, Model} from "../../base/model";
import {DateFormatter, DateFormtOption} from "../../util/dateformatter";
import {isDate, isNumber} from "util";
import {
  AddColumnOperation, AddCommentOperation, AddModelOperation, ChangeColumnTypeOperation, DropColumnOperation,
  RenameColumnOperation
} from "../migration/operation";
import {logInfo} from "../../util/logger";
import {GGModel} from "../../gg/ggmodel";
import {DateUtil} from "../../util/dateutil";

/**
 * PostgreSQL query builder.
 */
export class PgQueryBuilder implements QueryBuilder {

  buildSelectQuery(q: SelectQuery): string {
    let fields: string = "*";
    if (q.selectFields_.length > 0) {
      fields = q.selectFields_.join(",");
    } else if (q.cls_) {
      const sqlFields: SqlField[] = sqlContext.findSqlFields(q.cls_);
      for (let field of sqlFields) {
        q.selectFields_.push(field.columnName);
      }
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
        switch (eachJoinOn["joinType"]) {
          case JoinType.JOIN:
            sql = `${sql} JOIN ${eachJoinOn.tableName} ON (${eachJoinOn["on"]})`;
            break;
          case JoinType.LEFT_JOIN:
            sql = `${sql} LEFT JOIN ${eachJoinOn.tableName} ON (${eachJoinOn["on"]})`;
            break;
          case JoinType.RIGHT_JOIN:
            sql = `${sql} RIGHT JOIN ${eachJoinOn.tableName} ON (${eachJoinOn["on"]})`;
            break;
          case JoinType.INNER:
            sql = `${sql} INNER JOIN ${eachJoinOn.tableName} ON (${eachJoinOn["on"]})`;
            break;
        }
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

    // PG 有分号 Gago-data 不兼容
    // sql += ";";

    return sql;
  }

  buildDeleteQuery(q: DeleteQuery): string {
    let sql: string = `DELETE FROM ${q.table_}`;
    if (q.where_) {
      sql = `${sql} WHERE ${q.where_}`;
    }
    sql += ";";
    return sql;
  }

  buildInsertQuery(q: InsertQuery): string {
    if (q.model_) {
      // 处理 GGModel 中 created_at, updated_at 的默认值
      if (q.model_ instanceof GGModel) {
        const modelRef: GGModel = q.model_;
        if (modelRef.config.autoInsertCreatedAtUsingNow && modelRef.createdAt === undefined) {
          modelRef.createdAt = DateUtil.nowInTimestamp();
        }

        if (modelRef.config.autoInsertUpdatedAtUsingNow && modelRef.updatedAt === undefined) {
          modelRef.updatedAt = DateUtil.nowInTimestamp();
        }
      }

      let modelSqlInfo: ModelSqlInfo = this.getSqlInfoFromDefinition(q.model_);

      let primaryKey: string = modelSqlInfo.primaryKey;
      let keys: Array<string> = modelSqlInfo.keys;
      let values: Array<string> = modelSqlInfo.values;

      const keysStr: string = keys.join(",");
      const valuesStr: string = values.join(",");

      const tableName: string = sqlContext.findTableByClass(q.model_.constructor);
      const primaryKeySqlField: SqlField | undefined = sqlContext.findPrimaryKeySqlFieldByClass(q.model_.constructor);

      if (primaryKeySqlField) {
        if (primaryKeySqlField.defaultValue) {
          if (primaryKeySqlField.defaultValue.type === SqlDefaultValueType.UUID) {
            if (q.returnId_) {
              return `INSERT INTO ${tableName} (${primaryKey}, ${keysStr}) VALUES ('${uuid.v4()}', ${valuesStr}) RETURNING ${primaryKey};`;
            } else {
              return `INSERT INTO ${tableName} (${primaryKey}, ${keysStr}) VALUES ('${uuid.v4()}', ${valuesStr});`;
            }
          }
        }
      }

      if (q.returnId_ && primaryKey) {
        return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr}) RETURNING ${primaryKey};`;
      }

      return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr});`;
    } else if (q.table_) {
      if (q.columns_.length > 0 && (q.columns_.length === q.values_.length)) {
        let keysStr: string = q.columns_.join(",");
        let valuesStr: string = q.values_.join(",");
        let returnValue: string = q.returnValue_;
        return `INSERT INTO ${q.table_} (${keysStr}) VALUES (${valuesStr}) RETURNING ${returnValue};`;
      }
    }
    return "";
  }

  buildUpdateQuery(q: UpdateQuery): string {
    if (q.model_) {
      // 处理 GGModel 中 updated_at 的默认值
      if (q.model_ instanceof GGModel) {
        const modelRef: GGModel = q.model_;
        if (modelRef.config.autoUpdateUpdatedAtUsingNow && modelRef.updatedAt === undefined) {
          modelRef.updatedAt = DateUtil.nowInTimestamp();
        }
      }

      let updatesAry: string[] = [];
      const sqlDefinitions: Array<SqlField> = sqlContext.findSqlFields(q.model_.constructor);

      for (let sqlField of sqlDefinitions) {
        if (sqlField.flag === SqlFlag.PRIMARY_KEY) {
          // default ignore primary key to keys array
        } else if (sqlField.name) {
          let key: string = sqlField.columnName;
          let value: any = q.model_[sqlField.name];
          if (value !== undefined && value !== null) {
            value = this.valueAsStringByType(value, sqlField.type);
            updatesAry.push(`${key}=${value}`);
          }
        }
      }

      q.tableNameFromClass(q.model_.constructor);
      q.setValuesSqlFromModel_ = updatesAry.join(",");

      return `UPDATE ${q.table_} SET ${q.setValuesSqlFromModel_} WHERE ${q.where_};`;
    } else {
      let updatesAry: string[] = [];
      q.updates_.forEach((update: { key: string, value: any }) => {
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

      let value: string = this.valueAsStringByType(kv.value, kv.sqlType);
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
          if (flag !== "") {
            sql += `${sqlField.columnName} SERIAL ${flagWithWhiteSpace} ${comma}${comment}\n`;
          } else {
            sql += `${sqlField.columnName} SERIAL${comma}${comment}\n`;
          }
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
  buildAddCommentOperation(op: AddCommentOperation): string | undefined {
    let sql: string = "";
    const tableName: string = sqlContext.findTableByClass(op.modelClass);
    const sqlFields: SqlField[] = sqlContext.findSqlFields(op.modelClass);
    for (let sqlField of sqlFields) {
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
      case SqlType.INT:
        return "INTEGER";
      case SqlType.BIGINT:
        return "BIGINT";
      case SqlType.VARCHAR_1024:
        return "VARCHAR(1024)";
      case SqlType.VARCHAR_255:
        return "VARCHAR(255)";
      case SqlType.TIMESTAMP:
        return "TIMESTAMP";
      case SqlType.TIMESTAMP_WITH_TIMEZONE:
        return "TIMESTAMP WITH TIME ZONE"
      case SqlType.JSON:
        return "JSON";
      case SqlType.NUMERIC:
        return "NUMERIC";
      case SqlType.DATE:
        return "DATE";
      case SqlType.TEXT:
        return "TEXT";
      case SqlType.BOOLEAN:
        return "BOOLEAN";
      case SqlType.GEOMETRY:
        return "GEOMETRY";
      default:
        throw Error(`Undefined SqlType ${sqlType}`);
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

  /**
   * Gets model sql definition infos.
   * @param model Model object.
   * @returns {ModelSqlInfo} Result information.
   */
  getSqlInfoFromDefinition(model: Model): ModelSqlInfo {
    let modelInfo: ModelSqlInfo = {primaryKey: "", keys: [], values: []};

    const sqlDefinitions: Array<SqlField> = sqlContext.findSqlFields(model.constructor);

    for (let sqlField of sqlDefinitions) {
      if (sqlField.flag === SqlFlag.PRIMARY_KEY) {
        modelInfo.primaryKey = sqlField.columnName; // default not pushes primary key to keys array
      } else if (sqlField.name) {
        if (model[sqlField.name] !== undefined) {
          modelInfo.keys.push(sqlField.columnName);
          let value: any = model[sqlField.name];
          value = this.valueAsStringByType(value, sqlField.type);
          modelInfo.values.push(value);
        } else {
          if (sqlField.flag === SqlFlag.NOT_NULL) { // if NOT_NULL value is undefined, log its error
            logInfo(`value (model[${sqlField.name}]) not found`);
          }
        }
      } else {
        logInfo(`Unknown sqlField ${sqlField.name}, ${sqlField.columnName}`);
      }
    }

    return modelInfo;
  }

  valueAsStringByType(value: any, sqlType: SqlType): string {
    if (sqlType === SqlType.VARCHAR_255 || sqlType === SqlType.TEXT || sqlType === SqlType.VARCHAR_1024) {
      if (value !== null) {
        value = `'${value}'`;
      } else {
        value = `${value}`;
      }
    } else if (sqlType === SqlType.DATE) {
      let valueAsDateInSql: string = DateFormatter.stringFromDate(value, DateFormtOption.YEAR_MONTH_DAY, "-");
      value = `'${valueAsDateInSql}'::date`;
    } else if (sqlType === SqlType.TIMESTAMP) {
      if (isNumber(value)) {
        value = `to_timestamp(${value})`;
      } else if (isDate(value)) {
        let tmp = Math.floor(new Date(value).getTime() / 1000);
        value = `to_timestamp(${tmp})`;
      }
    } else if (sqlType === SqlType.JSON) {
      if (typeof value === "string") {
        value = `'${value}'::json`;
      } else {
        value = `'${JSON.stringify(value)}'::json`;
      }
    } else if (sqlType === SqlType.GEOMETRY) {
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      value = `ST_GeomFromGeoJSON('${value}')::geometry`;
    } else if (sqlType === SqlType.INT ||
      sqlType === SqlType.BIGINT ||
      sqlType === SqlType.BOOLEAN ||
      sqlType === SqlType.NUMERIC) {
      value = String(`${value}`);
    } else {
      logInfo(`Unknown SqlType is ${sqlType}, value is ${value}`);
    }

    return value;
  }
}