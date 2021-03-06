// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as util from "util";
import * as uuid from "uuid";

import {QueryBuilder} from "../querybuilder";
import {SelectQuery, JoinType} from "../../sqlquery/selectquery";
import {DeleteQuery} from "../../sqlquery/deletequery";
import {InsertQuery} from "../../sqlquery/insertquery";
import {ModelSqlInfo} from "../querybuilder";
import {sqlContext} from "../../util/sqlcontext";
import {UpdateQuery} from "../../sqlquery/updatequery";
import {ReplaceQuery} from "../../sqlquery/replacequery";
import {DateFormatter, DateFormtOption} from "../../util/dateformatter";
import {isDate, isNumber} from "util";

import {
  AddColumnOperation, AddCommentOperation, AddModelOperation, ChangeColumnTypeOperation, DropColumnOperation,
  RenameColumnOperation
} from "../migration/operation";
import {SqlDefaultValue, SqlDefaultValueType, SqlField, SqlFlag, SqlType, Model} from "../../base/model";
import {SqlFieldNameNotFound} from "../error/sqlfieldnamenotfounderror";
import {UnknownSqlFieldError} from "../error/unknownsqlfielderror";
import {logError} from "../../util/logger";
import {GGModel} from "../../gg/ggmodel";
import {DateUtil} from "../../util/dateutil";

/**
 * MySQL query builder.
 */
export class MySqlQueryBuilder implements QueryBuilder {

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
      let noneSerialId: string = "";
      let isNoneSerialId: boolean = false;

      // 处理一些特殊的 sql fields
      let fields: SqlField[] = sqlContext.findSqlFields(q.model_.constructor);
      for (let field of fields) {
        if (field.flag === SqlFlag.PRIMARY_KEY) {
          // 主键的特殊场景
          if (field.defaultValue.type === SqlDefaultValueType.MAKE_RANDOM_ID) { // 如果主键默认值是随机数， 则在插入时自动添加一个随机数主键
            keys.push(primaryKey);
            noneSerialId = `'${`${Math.random()}`.slice(2)}'`;
            values.push(noneSerialId);
            isNoneSerialId = true;
          } else if (field.defaultValue.type === SqlDefaultValueType.UUID) { // 如果主键默认值是 UUID，则使用 UUID v4
            keys.push(primaryKey);
            noneSerialId = `'${uuid.v4()}'`;
            isNoneSerialId = true;
            values.push(noneSerialId);
          }
          break;
        }

      }

      const keysStr: string = keys.join(",");
      const valuesStr: string = values.join(",");

      const tableName: string = sqlContext.findTableByClass(q.model_.constructor);
      const lastInsertId: string = isNoneSerialId ? noneSerialId : "last_insert_id()";

      if (q.returnId_ && primaryKey && modelSqlInfo.primaryKey) {
        return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr}); SELECT ${lastInsertId} AS ${primaryKey};`;
      }

      return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr})`;
    } else if (q.table_) {
      if (q.columns_.length > 0 && (q.columns_.length === q.values_.length)) {
        let keyIteration: IterableIterator<Function> = sqlContext.getTables().keys();
        let specificPrimaryKey: SqlField;
        let iterationValue: Function = keyIteration.next().value;
        while (typeof iterationValue !== "undefined") {
          const tableName: string = sqlContext.findTableByClass(iterationValue);
          if (tableName === q.table_) {
            specificPrimaryKey = sqlContext.findPrimaryKeySqlFieldByClass(iterationValue);
            break;
          }
          iterationValue = keyIteration.next().value;
        }

        let noneSerialId: string = "";
        let isNoneSerialId: boolean = false;
        let lastInsertId: string = "last_insert_id()";

        if (typeof specificPrimaryKey !== "undefined" && q.columns_.indexOf(specificPrimaryKey.columnName) === -1) {
          q.columns_.push(specificPrimaryKey.columnName);
          if (specificPrimaryKey.defaultValue.type === SqlDefaultValueType.MAKE_RANDOM_ID) { // 如果主键默认值是随机数， 则在插入时自动添加一个随机数主键
            noneSerialId = `'${`${Math.random()}`.slice(2)}'`;
            q.values_.push(noneSerialId);
            isNoneSerialId = true;
            lastInsertId = `${noneSerialId} AS ${specificPrimaryKey.columnName}`;
          } else if (specificPrimaryKey.defaultValue.type === SqlDefaultValueType.UUID) { // 如果主键默认值是 UUID，则使用 UUID v4
            noneSerialId = `'${uuid.v4()}'`;
            q.values_.push(noneSerialId);
            isNoneSerialId = true;
            lastInsertId = `${noneSerialId} AS ${specificPrimaryKey.columnName}`;
          }
        }

        let keysStr: string = q.columns_.join(",");
        let valuesStr: string = q.values_.join(",");
        let returnValue: string = q.returnValue_;

        return `INSERT INTO ${q.table_} (${keysStr}) VALUES (${valuesStr}); SELECT ${lastInsertId};`;
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
   * Gets model sql definition infos.
   * @param model Model object.
   * @returns {ModelSqlInfo} Result information.
   * @throws {SqlFieldNameNotFound} When model[sqlField.name] is undefined.
   * @throws {UnknownSqlFieldError} when sqlField is wrong.
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
        } else if (sqlField.flag === SqlFlag.NOT_NULL) {
          // NOT_NULL
          throw new SqlFieldNameNotFound(sqlField.name);
        } else {
          // NULLABLE
        }
      } else {
        throw new UnknownSqlFieldError(sqlField);
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
      value = `STR_TO_DATE('${valueAsDateInSql}', '%Y-%m-%d')`;
    } else if (sqlType === SqlType.TIMESTAMP || sqlType === SqlType.TIMESTAMP_WITH_TIMEZONE) {
      if (isNumber(value)) {
        value = `FROM_UNIXTIME(${value})`;
      } else if (isDate(value)) {
        let tmp = Math.floor(new Date(value).getTime() / 1000);
        value = `FROM_UNIXTIME(${tmp})`;
      }
    } else if (sqlType === SqlType.JSON || sqlType === SqlType.JSONB) {
      if (typeof value === "string") {
        value = `'${value}'`;
      } else {
        value = `'${JSON.stringify(value)}'`;
      }
    } else if (sqlType === SqlType.GEOMETRY) {
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      value = `ST_GeomFromGeoJSON('${value}', 1, 0)`;
    } else if (sqlType === SqlType.INT ||
      sqlType === SqlType.BIGINT ||
      sqlType === SqlType.BOOLEAN ||
      sqlType === SqlType.NUMERIC) {
      value = String(`${value}`);
    } else {
      logError(`Unknown SqlType is ${sqlType}, value is ${value}`);
    }

    return value;
  }

  /**
   * Translate SqlType to string used in CREATE TABLE syntax.
   * eg: SqlType.INT will be translated to "INTEGER".
   * @private
   */
  private sqlTypeToCreateSyntaxString_(sqlType: SqlType): string {
    switch (sqlType) {
      case SqlType.INT:
        return "INT";
      case SqlType.BIGINT:
        return "BIGINT";
      case SqlType.VARCHAR_1024:
        return "VARCHAR(1024)";
      case SqlType.VARCHAR_255:
        return "VARCHAR(255)";
      case SqlType.TIMESTAMP:
        return "TIMESTAMP NULL DEFAULT NULL";
      case SqlType.JSON:
        return "JSON";
      case SqlType.JSONB:
        return "JSON";
      case SqlType.NUMERIC:
        return "DECIMAL(18,8)";
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

    if (sqlDefaultValue.type === SqlDefaultValueType.NUMBER) {
      return `${sqlDefaultValue.getValue()}`;
    }

    return "";
  }
}