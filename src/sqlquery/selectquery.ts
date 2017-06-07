// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";
import {Query, QueryType} from "./query";

/**
 * Builds select sql query.
 */
export class SelectQuery implements Query {
  table_: string;
  where_: string;
  selectFields_: string[];
  orderBys_: { sort: string, order: "ASC" | "DESC" }[] = [];
  limit_: number;
  offset_: number;
  joinUsings_: string[] = [];
  groupBy_: string[] = [];

  type(): QueryType {
    return QueryType.SELECT;
  }

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

  fromTable(table: string): this {
    this.table_ = table;
    return this;
  }

  joinUsing(joninStr: string): this {
    this.joinUsings_.push(joninStr);
    return this;
  }

  groupBy(...fields: string[]): this {
    this.groupBy_ = fields;
    return this;
  }

  select(fields: string[] = []): this {
    this.selectFields_ = fields;
    return this;
  }

  where(...args: any[]): this {
    this.where_ = args.join(" AND ");
    return this;
  }

  orderBy(sort: string, order: "ASC" | "DESC" = "ASC"): this {
    this.orderBys_.push({sort: sort, order: order});
    return this;
  }

  setLimit(limit: number): this {
    this.limit_ = limit;
    return this;
  }

  setOffset(offset: number): this {
    this.offset_ = offset;
    return this;
  }
}
