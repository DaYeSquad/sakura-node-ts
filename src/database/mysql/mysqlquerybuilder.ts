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
import {
  AddColumnOperation, AddCommentOperation, AddModelOperation, ChangeColumnTypeOperation, DropColumnOperation,
  RenameColumnOperation
} from "../migration/operation";

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
        return `
        INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr});
        SELECT LAST_INSERT_ID();
        `;
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
  buildCreateTableOperation(operation: AddModelOperation): string {
    // TODO(lin.xiaoe.f@gmail.com):
    return "";
  }

  /**
   * Builds {AddCommentOperation} to raw query.
   * @param operation {AddCommentOperation} object.
   */
  buildAddCommentOperation(operation: AddCommentOperation): string {
    // TODO(lin.xiaoe.f@gmail.com):
    return "";
  }

  /**
   * Builds {AddColumnOperation} to raw query.
   * @param operation {AddColumnOperation} object.
   */
  buildAddColumnOperation(operation: AddColumnOperation): string {
    // TODO(lin.xiaoe.f@gmail.com):
    return "";
  }

  /**
   * Builds {DropColumnOperation} to raw query.
   * @param operation {DropColumnOperation} object.
   */
  buildDropColumnOperation(operation: DropColumnOperation): string {
    // TODO(lin.xiaoe.f@gmail.com):
    return "";
  }

  /**
   * Builds {RenameColumnOperation} to raw query.
   * @param operation {RenameColumnOperation} object.
   */
  buildRenameColumnOperation(operation: RenameColumnOperation): string {
    // TODO(lin.xiaoe.f@gmail.com):
    return "";
  }

  /**
   * Builds {ChangeColumnTypeOperation} to raw query.
   * @param operation {ChangeColumnTypeOperation} object.
   */
  buildChangeColumnTypeOperation(operation: ChangeColumnTypeOperation): string {
    // TODO(lin.xiaoe.f@gmail.com):
    return "";
  }
}