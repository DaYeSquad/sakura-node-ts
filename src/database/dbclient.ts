// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Driver} from "./driver";
import {QueryResult} from "./queryresult";
import {UnknownDriverError} from "./error/unknowndrivererror";
import {PgDriver} from "./postgres/pgdriver";
import {DriverOptions, DriverType} from "./driveroptions";
import {MySqlDriver} from "./mysql/mysqldriver";
import {Query, QueryType} from "../sqlquery/query";
import {InternalError} from "./error/internalerror";
import {SelectQuery} from "../sqlquery/selectquery";
import {InsertQuery} from "../sqlquery/insertquery";
import {DeleteQuery} from "../sqlquery/deletequery";
import {UpdateQuery} from "../sqlquery/updatequery";
import {ReplaceQuery} from "../sqlquery/replacequery";
import {raw} from "body-parser";

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

    if (driverOptions.type === DriverType.POSTGRES) {
      DBClient.instance_.driver_ = new PgDriver(driverOptions);
    } else if (driverOptions.type === DriverType.MYSQL) {
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
   * @param q Query string or query object.
   * @returns {Promise<QueryResult>} Query result.
   */
  async query(q: string): Promise<QueryResult>;
  async query(q: Query): Promise<QueryResult>;
  async query(q: any): Promise<QueryResult> {
    if (q instanceof Query) {
      let rawSql: string = this.queryToString_(q);
      return await this.driver_.query(rawSql);
    } else {
      return await this.driver_.query(q);
    }
  }

  /**
   * Executes SQL queries in transaction.
   * @param sqls Query strings.
   * @returns {Promise<QueryResult>} Query result.
   */
  async queryRawInTransaction(sqls: string[]): Promise<QueryResult> {
    return await this.driver_.queryInTransaction(sqls);
  }

  /**
   * Executes SQL queries in transaction.
   * @param queries Query objects.
   * @returns {Promise<QueryResult>} Query result.
   */
  async queryInTransaction(queries: Query[]): Promise<QueryResult> {
    let sqls: Array<string> = [];

    for (let query of queries) {
      sqls.push(this.queryToString_(query));
    }

    return await this.queryRawInTransaction(sqls);
  }

  private queryToString_(q: Query): string {
    let rawSql: string = "";

    switch (q.type()) {
      case QueryType.SELECT: {
        rawSql = this.driver_.buildSelectQuery(<SelectQuery>q);
        break;
      }
      case QueryType.UPDATE: {
        rawSql = this.driver_.buildUpdateQuery(<UpdateQuery>q);
        break;
      }
      case QueryType.REPLACE: {
        rawSql = this.driver_.buildReplaceQuery(<ReplaceQuery>q);
        break;
      }
      case QueryType.INSERT: {
        rawSql = this.driver_.buildInsertQuery(<InsertQuery>q);
        break;
      }
      case QueryType.DELETE: {
        rawSql = this.driver_.buildDeleteQuery(<DeleteQuery>q);
        break;
      }
      default: {
        throw new InternalError(DBClient.name);
      }
    }

    return rawSql;
  }
}
