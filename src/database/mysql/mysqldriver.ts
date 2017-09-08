// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as mysql from "mysql";

import {Driver} from "../driver";
import {ClusterOptions, DriverConnectionOptions, DriverOptions} from "../driveroptions";
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
  private cluster_: mysql.IPoolCluster;

  queryBuilder: QueryBuilder = new MySqlQueryBuilder();

  constructor(driverOptions: DriverOptions) {
    super();

    if (driverOptions.clusterOptions) {
      this.cluster_ = mysql.createPoolCluster({
        defaultSelector: "RANDOM" // select the first node available unconditionally
      });

      let clusterOptions: ClusterOptions = driverOptions.clusterOptions;

      this.cluster_.add("MASTER", {
        connectionLimit: clusterOptions.master.max || 10,
        host: clusterOptions.master.host || driverOptions.host,
        port: clusterOptions.master.port || driverOptions.port || 3306,
        user: clusterOptions.master.username || driverOptions.username,
        password: clusterOptions.master.password || driverOptions.password,
        database: clusterOptions.master.database || driverOptions.database,
        multipleStatements: true
      });

      for (let i = 0; i < clusterOptions.slaves.length; i++) {
        let slaveDriverOption: DriverConnectionOptions = clusterOptions.slaves[i];

        this.cluster_.add(`SLAVE${i}`, {
          connectionLimit: slaveDriverOption.max || 10,
          host: slaveDriverOption.host || driverOptions.host,
          port: slaveDriverOption.port || driverOptions.port || 3306,
          user: slaveDriverOption.username || driverOptions.username,
          password: slaveDriverOption.password || driverOptions.password,
          database: slaveDriverOption.database || driverOptions.database,
          multipleStatements: true
        });
      }
    } else {
      this.pool_ = mysql.createPool({
        connectionLimit: driverOptions.max || 10,
        host: driverOptions.host,
        user: driverOptions.username,
        password: driverOptions.password,
        database: driverOptions.database,
        port: driverOptions.port || 3306,
        multipleStatements: true
      });
    }
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

      this.getConnection_(q, (err: mysql.IError, connection: mysql.IConnection) => {
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

  private getConnection_(q: any, callback: (err: mysql.IError, connection: mysql.IConnection) => void): void {
    if (this.pool_) {
      this.pool_.getConnection(callback);
    } else if (this.cluster_) {
      // For read-only connection, use slave, master otherwise
      let connectionFlag: string = "MASTER";

      if (q instanceof Query) {
        if (q.type() === QueryType.SELECT) {
          connectionFlag = "SLAVE*";
        }
      }

      this.cluster_.getConnection(connectionFlag, callback);
    }
  }
}
