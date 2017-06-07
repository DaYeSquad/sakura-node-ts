// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {QueryResult} from "./queryresult";
import {SelectQuery} from "../sqlquery/selectquery";
import {DeleteQuery} from "../sqlquery/deletequery";
import {InsertQuery} from "../sqlquery/insertquery";
import {ReplaceQuery} from "../sqlquery/replacequery";
import {UpdateQuery} from "../sqlquery/updatequery";

/**
 * Each database should implements this interface.
 */
export interface Driver {

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

  /**
   * Builds {SelectQuery} to raw query.
   * @param query {SelectQuery} object.
   */
  buildSelectQuery(query: SelectQuery): string;

  /**
   * Builds {DeleteQuery} to raw query.
   * @param query {DeleteQuery} object.
   */
  buildDeleteQuery(query: DeleteQuery): string;

  /**
   * Builds {InsertQuery} to raw query.
   * @param query {InsertQuery} object.
   */
  buildInsertQuery(query: InsertQuery): string;

  /**
   * Builds {UpdateQuery} to raw query.
   * @param query {UpdateQuery} object.
   */
  buildUpdateQuery(query: UpdateQuery): string;

  /**
   * Builds {ReplaceQuery} to raw query.
   * @param query {ReplaceQuery} object.
   */
  buildReplaceQuery(query: ReplaceQuery): string;
}
