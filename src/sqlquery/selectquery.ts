// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";
import {Query, QueryType} from "./query";
import {SqlField} from "../base/model";
import {DBClient} from "../database/dbclient";

export enum JoinType {
  JOIN,
  LEFT_JOIN,
  RIGHT_JOIN,
  INNER
}

/**
 * Builds select sql query.
 */
export class SelectQuery extends Query {
  cls_: Function | undefined;
  table_: string;
  where_: string;
  selectFields_: string[] = [];
  orderBys_: { sort: string, order: "ASC" | "DESC" }[] = [];
  limit_: number;
  offset_: number;
  joinUsings_: string[] = [];
  joinOn_: Array<{ tableName: string, joinType: JoinType, on: string }> = [];
  groupBy_: string[] = [];

  type(): QueryType {
    return QueryType.SELECT;
  }

  from(table: string): this {
    this.table_ = table;
    return this;
  }

  fromClass(cls: Function): this {
    this.cls_ = cls;
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

  join(tableName: string): this {
    this.joinOn_.push({tableName: tableName, joinType: JoinType.JOIN, on: null});
    return this;
  }

  leftJoin(tableName: string): this {
    this.joinOn_.push({tableName: tableName, joinType: JoinType.LEFT_JOIN, on: null});
    return this;
  }

  rightJoin(tableName: string): this {
    this.joinOn_.push({tableName: tableName, joinType: JoinType.RIGHT_JOIN, on: null});
    return this;
  }

  innerJoin(tableName: string): this {
    this.joinOn_.push({tableName: tableName, joinType: JoinType.INNER, on: null});
    return this;
  }

  on(onStr: string): this {
    let lastJoinIn: { tableName: string, joinType: JoinType, on: string } = this.joinOn_.pop();
    lastJoinIn["on"] = onStr;
    this.joinOn_.push(lastJoinIn);
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

  whereWithParam(sql: string, sqlValues: any) {
    if (sql.indexOf(":") >= 0) {
      Object.keys(sqlValues).forEach(key => {
        // String and Date need to add ''
        if (typeof sqlValues[key] === "string" || sqlValues[key] instanceof Date) {
          let value: string = DBClient.escape(sqlValues[key]);
          sql = sql.replace(":" + key, `${value}`);
        } else {
          sql = sql.replace(":" + key, sqlValues[key]);
        }
      });
    }
    this.where_ = sql;
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
