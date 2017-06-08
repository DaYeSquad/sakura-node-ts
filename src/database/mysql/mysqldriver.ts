// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as mysql from "mysql";

import {Driver} from "../driver";
import {DriverOptions} from "../driveroptions";
import {QueryResult} from "../queryresult";
import {QueryBuilder} from "../querybuilder";
import {MySqlQueryBuilder} from "./mysqlquerybuilder";

/**
 * MySQL driver.
 */
export class MySqlDriver implements Driver {
  private pool_: mysql.IPool;

  queryBuilder: QueryBuilder = new MySqlQueryBuilder();

  constructor(driverOptions: DriverOptions) {
    this.pool_ = mysql.createPool({
      connectionLimit: 10,
      host: driverOptions.host,
      user: driverOptions.username,
      password: driverOptions.password,
      database: driverOptions.database,
      port: driverOptions.port | 3306
    });
  }

  async query(sql: string): Promise<QueryResult> {
    return new Promise<QueryResult>((resolve, reject) => {
      this.pool_.getConnection((err: mysql.IError, connection: mysql.IConnection) => {
        if (err) reject(err);

        connection.query(sql, (err: mysql.IError, rows: any[], fields: mysql.IFieldInfo[]) => {
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
