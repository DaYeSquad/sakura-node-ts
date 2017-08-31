// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as mysql from "mysql";

import {Driver} from "../driver";
import {DriverOptions} from "../driveroptions";
import {QueryResult} from "../queryresult";
import {ModelSqlInfo, QueryBuilder} from "../querybuilder";
import {MySqlQueryBuilder} from "./mysqlquerybuilder";
import {Query, QueryType} from "../../sqlquery/query";
import {Operation} from "../migration/operation";
import {InsertQuery} from "../../sqlquery/insertquery";
import {query} from "winston";

/**
 * MySQL driver.
 */
export class MySqlDriver extends Driver {
  private pool_: mysql.IPool;

  queryBuilder: QueryBuilder = new MySqlQueryBuilder();

  constructor(driverOptions: DriverOptions) {
    super();
    this.pool_ = mysql.createPool({
      connectionLimit: 10,
      host: driverOptions.host,
      user: driverOptions.username,
      password: driverOptions.password,
      database: driverOptions.database,
      port: driverOptions.port || 3306,
      multipleStatements: true
    });
  }

  async query(q: string): Promise<QueryResult>;
  async query(q: Query): Promise<QueryResult>;
  async query(q: Operation): Promise<QueryResult>;
  async query(q: any): Promise<QueryResult> {
    return new Promise<QueryResult>((resolve, reject) => {
      let rawSql: string = "";

      // 在 PG 中，InsertQuery 之后会返回 row[primaryKey] = "<id>";
      // 在 MySQL 中为 row["insertId"] = "<id>"
      // 所以在 MySQL 中在之后会注入 row[primaryKey] = "<id>" 以兼容
      let insertQueryPKey: string | undefined = undefined;

      if (q instanceof Query) {
        rawSql = this.queryToString_(q);
        if (q.type() === QueryType.INSERT) {
          if ((<InsertQuery>q).model_) {
            let modelSqlInfo: ModelSqlInfo = this.queryBuilder.getSqlInfoFromDefinition((<InsertQuery>q).model_);
            insertQueryPKey = modelSqlInfo.primaryKey;
          }
        }
      } else if (q instanceof Operation) {
        rawSql = this.operationToString(q);
      } else {
        rawSql = q;
      }

      this.pool_.getConnection((err: mysql.IError, connection: mysql.IConnection) => {
        if (err) reject(err);

        connection.query(rawSql, (err: mysql.IError, rows: any[], fields: mysql.IFieldInfo[]) => {
          connection.release();

          if (err) reject(err);

          // 注入 primaryKey
          if (insertQueryPKey) {
            for (let row of rows) {
              row[insertQueryPKey] = row["insertId"];
            }
          }

          resolve({rows: rows});
        });
      });
    });
  }

  async queryInTransaction(sqls: string[]): Promise<QueryResult> {
    let bigSql: string = "START TRANSACTION;\n";
    for (let sql of sqls) {
      bigSql += sql;
    }
    bigSql += "\nCOMMIT;";

    return await this.query(bigSql);
  }
}
