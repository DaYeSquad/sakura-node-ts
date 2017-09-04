// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as pg from "pg";
import {Driver} from "../driver";
import {QueryResult} from "../queryresult";
import {DriverOptions} from "../driveroptions";
import {QueryBuilder} from "../querybuilder";
import {PgQueryBuilder} from "./pgquerybuilder";
import {Query, QueryType} from "../../sqlquery/query";
import {Operation} from "../migration/operation";

/**
 * PostgresSQL client using pg.Pool.
 */
export class PgDriver extends Driver {

  private pool_: pg.Pool;

  queryBuilder: QueryBuilder = new PgQueryBuilder();

  constructor(driverOptions: DriverOptions) {
    super();

    if (driverOptions.clusterOptions) {
      throw new Error("We do not support cluster mode in postgres right now, please issue if you want this feature");
    }

    let config: pg.PoolConfig = {
      user: driverOptions.username,
      database: driverOptions.database,
      password: driverOptions.password,
      host: driverOptions.host,
      port: driverOptions.port || 5432,
      max: 10,
      idleTimeoutMillis: 30000
    };

    this.pool_ = new pg.Pool(config);
  }

  async query(q: string): Promise<QueryResult>;
  async query(q: Query): Promise<QueryResult>;
  async query(q: Operation): Promise<QueryResult>;
  async query(q: any): Promise<QueryResult> {
    let rawSql: string = "";

    if (q instanceof Query) {
      rawSql = this.queryToString_(q);
    } else if (q instanceof Operation) {
      rawSql = this.operationToString(q);
    } else {
      rawSql = q;
    }

    let client: pg.Client = await this.pool_.connect();
    try {
      const pgQueryResult: pg.QueryResult = await client.query(rawSql);
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
}
