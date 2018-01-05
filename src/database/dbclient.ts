// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as mysql from "mysql";

import {Driver} from "./driver";
import {QueryResult} from "./queryresult";
import {UnknownDriverError} from "./error/unknowndrivererror";
import {PgDriver} from "./postgres/pgdriver";
import {DriverOptions, DriverType} from "./driveroptions";
import {MySqlDriver} from "./mysql/mysqldriver";
import {Query} from "../sqlquery/query";
import {Operation} from "./migration/operation";

/**
 * Database client.
 */
export class DBClient {

  private static instance_: DBClient;

  public driver: Driver;

  constructor(driverOptions: DriverOptions) {
    if (driverOptions.type === DriverType.POSTGRES) {
      this.driver = new PgDriver(driverOptions);
    } else if (driverOptions.type === DriverType.MYSQL) {
      this.driver = new MySqlDriver(driverOptions);
    } else {
      throw new UnknownDriverError(driverOptions.type);
    }
  }

  /**
   * Creates client by specific database.
   * @param driverOptions Driver options.
   */
  static createClient(driverOptions: DriverOptions): DBClient {
    DBClient.instance_ = new DBClient(driverOptions);
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
   * Escape value
   * @returns {string} Escaped value
   */
  static escape(value: any | undefined): string {
    return DBClient.getClient().escape(value);
  }

  /**
   * Escape value
   * @returns {string} Escaped value
   */
  escape(value: any | undefined): string {
    if (this.driver.type === DriverType.POSTGRES) {
      if (value === null || value === undefined) {
        return `''`;
      } else {
        return String(value);
      }
    } else if (this.driver.type === DriverType.MYSQL) {
      return mysql.escape(value);
    }
  }

  /**
   * Executes SQL query.
   * @param q Query string or query object.
   * @returns {Promise<QueryResult>} Query result.
   */
  async query(q: string): Promise<QueryResult>;
  async query(q: Query): Promise<QueryResult>;
  async query(q: Operation): Promise<QueryResult>;
  async query(q: any): Promise<QueryResult> {
    return await this.driver.query(q);
  }

  /**
   * Translate Query Object to SQL string.
   * @param q Query string or query object.
   * @returns {String}  sql String.
   */
  queryToString(q: Query): string;
  queryToString(q: Operation): string;
  queryToString(q: any): string {
    let rawSql: string = "";

    if (q instanceof Query) {
      rawSql = this.driver.queryToString_(q);
    } else if (q instanceof Operation) {
      rawSql = this.driver.operationToString(q);
    } else {
      rawSql = q;
    }
    return rawSql;
  }

  /**
   * Executes SQL queries in transaction.
   * @param sqls Query strings.
   * @returns {Promise<QueryResult>} Query result.
   */
  async queryRawInTransaction(sqls: string[]): Promise<QueryResult> {
    return await this.driver.queryInTransaction(sqls);
  }

  /**
   * Executes SQL queries in transaction.
   * @param queries Query objects.
   * @returns {Promise<QueryResult>} Query result.
   */
  async queryInTransaction(queries: Query[]): Promise<QueryResult> {
    let sqls: Array<string> = [];

    for (let query of queries) {
      let queryStr: string = this.driver.queryToString_(query);
      if (queryStr.charAt(queryStr.length - 1) !== ";") {
        queryStr += ";";
      }
      sqls.push(queryStr);
    }

    return await this.queryRawInTransaction(sqls);
  }
}
