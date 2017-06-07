// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as pg from "pg";
import {Driver} from "../driver";
import {QueryResult} from "../queryresult";
import {DriverOptions} from "../driveroptions";
import {SelectQuery} from "../../sqlquery/selectquery";
import {DeleteQuery} from "../../sqlquery/deletequery";
import {InsertQuery} from "../../sqlquery/insertquery";
import {ModelSqlInfo, SqlQuery} from "../../sqlquery/sqlquery";
import {sqlContext} from "../../util/sqlcontext";
import {UpdateQuery} from "../../sqlquery/updatequery";
import {ReplaceQuery} from "../../sqlquery/replacequery";
import {SqlField, SqlFlag, SqlType} from "../../base/model";
import {DateFormatter, DateFormtOption} from "../../util/dateformatter";
import {isDate, isNumber} from "util";

/**
 * PostgresSQL client using pg.Pool.
 */
export class PgDriver implements Driver {

  private pool_: pg.Pool;

  constructor(driverOptions: DriverOptions) {
    let config: pg.PoolConfig = {
      user: driverOptions.username,
      database: driverOptions.database,
      password: driverOptions.password,
      host: driverOptions.host,
      port: driverOptions.port | 5432,
      max: 10,
      idleTimeoutMillis: 30000
    };

    this.pool_ = new pg.Pool(config);
  }

  async query(sql: string): Promise<QueryResult> {
    let client: pg.Client = await this.pool_.connect();
    try {
      const pgQueryResult: pg.QueryResult = await client.query(sql);
      return {rows: pgQueryResult.rows};
    } finally {
      client.release();
    }
  }

  async queryInTransaction(sqls: string[]): Promise<QueryResult> {
    let bigSql: string = "BEGIN;";
    for (let sql of sqls) {
      bigSql += sql;
    }
    bigSql += "COMMIT;";

    return await this.query(bigSql);
  }

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
}
