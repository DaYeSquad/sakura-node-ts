// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";

/**
 * Delete query.
 *
 * Usage:
 *  let sql: string = new DeleteQuery().from('xx').where('a=c').build();
 */
export class DeleteQuery {
  private table_: string;
  private where_: string;

  from(table: string): this {
    this.table_ = table;
    return this;
  }

  fromClass(cls: Function): this {
    let table: string = sqlContext.findTableByClass(cls);
    if (table) {
      this.table_ = table;
    }
    return this;
  }

  where(...args: any[]): this {
    this.where_ = args.join(' AND ');
    return this;
  }

  build(): string {
    let sql: string = `DELETE * FROM ${this.table_}`;
    if (this.where_) {
      sql = `${sql} WHERE ${this.where_}`;
    }
    return sql;
  }
}