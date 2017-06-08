// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {SelectQuery} from "../sqlquery/selectquery";
import {DeleteQuery} from "../sqlquery/deletequery";
import {InsertQuery} from "../sqlquery/insertquery";
import {UpdateQuery} from "../sqlquery/updatequery";
import {ReplaceQuery} from "../sqlquery/replacequery";
import {
  AddColumnOperation, AddCommentOperation, AddModelOperation, ChangeColumnTypeOperation, DropColumnOperation,
  RenameColumnOperation
} from "./migration/operation";

/**
 * Query builder.
 */
export interface QueryBuilder {

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

  /**
   * Builds {AddModelOperation} to raw query.
   * @param operation {AddModelOperation} object.
   */
  buildCreateTableOperation(operation: AddModelOperation): string;

  /**
   * Builds {AddCommentOperation} to raw query.
   * @param operation {AddCommentOperation} object.
   */
  buildAddCommentOperation(operation: AddCommentOperation): string;

  /**
   * Builds {AddColumnOperation} to raw query.
   * @param operation {AddColumnOperation} object.
   */
  buildAddColumnOperation(operation: AddColumnOperation): string;

  /**
   * Builds {DropColumnOperation} to raw query.
   * @param operation {DropColumnOperation} object.
   */
  buildDropColumnOperation(operation: DropColumnOperation): string;

  /**
   * Builds {RenameColumnOperation} to raw query.
   * @param operation {RenameColumnOperation} object.
   */
  buildRenameColumnOperation(operation: RenameColumnOperation): string;

  /**
   * Builds {ChangeColumnTypeOperation} to raw query.
   * @param operation {ChangeColumnTypeOperation} object.
   */
  buildChangeColumnTypeOperation(operation: ChangeColumnTypeOperation): string;
}
