// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {QueryResult} from "./queryresult";
import {QueryBuilder} from "./querybuilder";
import {Query, QueryType} from "../sqlquery/query";
import {
  AddCommentOperation, AddModelOperation, Operation, OperationType, AddColumnOperation,
  DropColumnOperation, ChangeColumnTypeOperation, RenameColumnOperation,
} from "./migration/operation";
import {SelectQuery} from "../sqlquery/selectquery";
import {UpdateQuery} from "../sqlquery/updatequery";
import {ReplaceQuery} from "../sqlquery/replacequery";
import {InsertQuery} from "../sqlquery/insertquery";
import {DeleteQuery} from "../sqlquery/deletequery";
import {InternalError} from "./error/internalerror";
import {DBClient} from "./dbclient";
import {DriverType} from "./driveroptions";

/**
 * Each database should implements this interface.
 */
export abstract class Driver {

  /**
   * Query builder of database.
   */
  queryBuilder: QueryBuilder;

  /**
   * Type of driver
   */
  abstract type: DriverType;

  /**
   * Executes SQL query.
   * @param q Query string.
   * @returns {Promise<QueryResult>} Query result.
   */
  abstract async query(q: string): Promise<QueryResult>;
  abstract async query(q: Query): Promise<QueryResult>;
  abstract async query(q: Operation): Promise<QueryResult>;

  /**
   * Executes SQL queries in transaction.
   * @param sqls Query strings.
   * @returns {Promise<QueryResult>} Query result.
   */
  abstract async queryInTransaction(sqls: string[]): Promise<QueryResult>;

  queryToString_(q: Query): string {
    let rawSql: string = "";

    switch (q.type()) {
      case QueryType.SELECT: {
        rawSql = this.queryBuilder.buildSelectQuery(<SelectQuery>q);
        break;
      }
      case QueryType.UPDATE: {
        rawSql = this.queryBuilder.buildUpdateQuery(<UpdateQuery>q);
        break;
      }
      case QueryType.REPLACE: {
        rawSql = this.queryBuilder.buildReplaceQuery(<ReplaceQuery>q);
        break;
      }
      case QueryType.INSERT: {
        rawSql = this.queryBuilder.buildInsertQuery(<InsertQuery>q);
        break;
      }
      case QueryType.DELETE: {
        rawSql = this.queryBuilder.buildDeleteQuery(<DeleteQuery>q);
        break;
      }
      default: {
        throw new InternalError(DBClient.name);
      }
    }

    return rawSql;
  }

  operationToString(op: Operation): string | undefined {
    let rawSql: string = "";

    switch (op.type) {
      case OperationType.ADD_MODEL: {
        rawSql = this.queryBuilder.buildAddModelOperation(<AddModelOperation>op);
        break;
      }
      case OperationType.ADD_COMMENT: {
        rawSql = this.queryBuilder.buildAddCommentOperation(<AddCommentOperation>op);
        break;
      }
      case OperationType.ADD_COLUMN: {
        rawSql = this.queryBuilder.buildAddColumnOperation(<AddColumnOperation>op);
        break;
      }
      case OperationType.DROP_COLUMN: {
        rawSql = this.queryBuilder.buildDropColumnOperation(<DropColumnOperation>op);
        break;
      }
      case OperationType.RENAME_COLUMN: {
        rawSql = this.queryBuilder.buildRenameColumnOperation(<RenameColumnOperation>op);
        break;
      }
      case OperationType.CHANGE_COLUMN_TYPE: {
        rawSql = this.queryBuilder.buildChangeColumnTypeOperation(<ChangeColumnTypeOperation>op);
        break;
      }
      default: {
        throw new InternalError(DBClient.name);
      }
    }

    return rawSql;
  }
}
