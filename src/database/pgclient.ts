// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as pg from "pg";
import {PgClientConfig} from "./pgclientconfig";
import {PgQueryResult} from "../base/typedefines";

/**
 * PostgresSQL client using pg.Pool.
 */
export class PgClient {

  private static instance_: PgClient;

  private pool_: pg.Pool;

  init(user: string, password: string, database: string, host: string, port: number, max: number, idleTimeoutMillis: number): void {
    let config: pg.PoolConfig = {
      user: user,
      database: database,
      password: password,
      host: host,
      port: port,
      max: max,
      idleTimeoutMillis: idleTimeoutMillis
    };

    this.pool_ = new pg.Pool(config);
  }

  initWithPgClientConfig(config: PgClientConfig): void {
    this.init(config.user, config.password, config.datebase, config.host, config.port, 10, 30000);
  }

  /**
   * Get shared instance.
   * @returns {PgClient}
   */
  static getInstance(): PgClient {
    return PgClient.instance_;
  }

  /**
   * Set shared instance.
   * @param client PgClient instance.
   */
  static setInstance(client: PgClient): void {
    PgClient.instance_ = client;
  }

  /**
   * Query database with sql, you may want to use try catch to get the error returned in Promise.
   * @param sql SQL.
   * @returns {QueryResult} Result of query.
   */
  async query(sql: string): Promise<pg.QueryResult> {
    let client: pg.Client = await this.pool_.connect();
    try {
      return await client.query(sql);
    } finally {
      client.release();
    }
  }

  /**
   * Runs queries in transaction.
   * @param sqls SQLs.
   * @returns {pg.QueryResult} Result.
   */
  async queryInTransaction(sqls: string[]): Promise<PgQueryResult> {
    let bigSql: string = "BEGIN;";
    for (let sql of sqls) {
      bigSql += sql;
    }
    bigSql += "COMMIT;";

    return await this.query(bigSql);
  }
}
