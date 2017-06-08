// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {QueryResult} from "./queryresult";
import {QueryBuilder} from "./querybuilder";

/**
 * Each database should implements this interface.
 */
export interface Driver {

  /**
   * Query builder of database.
   */
  queryBuilder: QueryBuilder;

  /**
   * Executes SQL query.
   * @param sql Query string.
   * @returns {Promise<QueryResult>} Query result.
   */
  query(sql: string): Promise<QueryResult>;

  /**
   * Executes SQL queries in transaction.
   * @param sqls Query strings.
   * @returns {Promise<QueryResult>} Query result.
   */
  queryInTransaction(sqls: string[]): Promise<QueryResult>;
}
