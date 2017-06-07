// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";
import {SqlType} from "../base/model";
import {SqlQuery} from "./sqlquery";
import {Query, QueryType} from "./query";

/**
 * Insert or replace.
 *
 * Usage:
 *  const sql: string = new ReplaceQuery().fromClass(WeatherCacheInfo).where("xx=xx").set(x, y).set(z, c).build();
 *  PgDriver.getInstance().query(sql);
 */
export class ReplaceQuery implements Query {
  table_: string;
  where_: string;
  newValues_: {key: string, value: any, sqlType: SqlType}[] = [];

  type(): QueryType {
    return QueryType.REPLACE;
  }

  fromClass(cls: Function): this {
    let table: string = sqlContext.findTableByClass(cls);
    if (table) {
      this.table_ = table;
    }
    return this;
  }

  where(...args: any[]): this {
    this.where_ = args.join(" AND ");
    return this;
  }

  set(key: string, value: any, sqlType: SqlType): this {
    this.newValues_.push({key: key, value: value, sqlType: sqlType});
    return this;
  }
}
