// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";
import {Model, SqlType} from "../base/model";
import {Query, QueryType} from "./query";
import {DBClient} from "../database/dbclient";

/**
 * Insert or replace.
 *
 * Usage:
 *  const sql: string = new ReplaceQuery().fromClass(WeatherCacheInfo).where("xx=xx").set(x, y).set(z, c).build();
 *  PgDriver.getInstance().query(sql);
 */
export class ReplaceQuery extends Query {
  cls_: Function;
  table_: string;
  where_: string;
  newValues_: {key: string, value: any, sqlType: SqlType}[] = [];

  type(): QueryType {
    return QueryType.REPLACE;
  }

  fromClass(cls: Function): this {
    this.cls_ = cls;

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

  whereWithParam(sql: string, sqlValues: any) {
    if (sql.indexOf(":") >= 0) {
      Object.keys(sqlValues).forEach(key => {
        // String and Date need to add ''
        if (typeof sqlValues[key] === "string" || sqlValues[key] instanceof Date) {
          let value: string = DBClient.escape(sqlValues[key]);
          sql = sql.replace(":" + key, `'${value}'`);
        } else {
          sql = sql.replace(":" + key, sqlValues[key]);
        }
      });
    }
    this.where_ = sql;
    return this;
  }

  set(key: string, value: any, sqlType: SqlType): this {
    this.newValues_.push({key: key, value: value, sqlType: sqlType});
    return this;
  }
}
