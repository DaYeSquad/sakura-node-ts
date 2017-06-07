// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Driver} from "./driver";
import {QueryResult} from "./queryresult";
import {UnknownDriverError} from "./error/unknowndrivererror";
import {PgDriver} from "./postgres/pgdriver";
import {DriverOptions} from "./driveroptions";
import {MySqlDriver} from "./mysql/mysqldriver";

/**
 * Database client.
 */
export class DBClient {

  private static instance_: DBClient;

  private driver_: Driver;

  /**
   * Creates client by specific database.
   * @param driverOptions Driver options.
   */
  static createClient(driverOptions: DriverOptions): DBClient {
    DBClient.instance_ = new DBClient();

    if (driverOptions.type === "postgres") {
      DBClient.instance_.driver_ = new PgDriver(driverOptions);
    } else if (driverOptions.type === "mysql") {
      DBClient.instance_.driver_ = new MySqlDriver(driverOptions);
    } else {
      throw new UnknownDriverError(driverOptions.type);
    }

    return DBClient.instance_;
  }

  /**
   * Gets singleton initialized instance.
   * @return Initialized DBClient.
   */
  static getClient(): DBClient {
    return DBClient.instance_;
  }

  /**
   * Executes SQL query.
   * @param sql Query string.
   * @returns {Promise<QueryResult>} Query result.
   */
  async query(sql: string): Promise<QueryResult> {
    return await this.driver_.query(sql);
  }

  /**
   * Executes SQL queries in transaction.
   * @param sqls Query strings.
   * @returns {Promise<QueryResult>} Query result.
   */
  async queryInTransaction(sqls: string[]): Promise<QueryResult> {
    return await this.driver_.queryInTransaction(sqls);
  }
}
