// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as mysql from "mysql";

import {Driver} from "../driver";
import {DriverOptions} from "../driveroptions";
import {QueryResult} from "../queryresult";
import {QueryBuilder} from "../querybuilder";
import {MySqlQueryBuilder} from "./mysqlquerybuilder";
import {Query, QueryType} from "../../sqlquery/query";
import {Operation} from "../migration/operation";
import {InsertQuery} from "../../sqlquery/insertquery";

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
      port: driverOptions.port | 3306
    });
  }

  async query(q: string): Promise<QueryResult>;
  async query(q: Query): Promise<QueryResult>;
  async query(q: Operation): Promise<QueryResult>;
  async query(q: any): Promise<QueryResult> {
    return new Promise<QueryResult>((resolve, reject) => {
      let rawSql: string = "";

      if (q instanceof Query) {
        rawSql = this.queryToString_(q);
        if (q.type() === QueryType.INSERT) {
          const insertQ: InsertQuery = <InsertQuery>q;
          if (insertQ.returnId_) {
            console.log("it has some error");
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

          resolve({rows: rows});
        });
      });
    });
  }

  async queryInTransaction(sqls: string[]): Promise<QueryResult> {
    let bigSql: string = "START TRANSACTION;";
    for (let sql of sqls) {
      bigSql += sql;
    }
    bigSql += "COMMIT;";

    return await this.query(bigSql);
  }
}
