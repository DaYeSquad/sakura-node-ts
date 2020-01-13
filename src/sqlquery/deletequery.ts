// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";
import {Query, QueryType} from "./query";
import {DBClient} from "../database/dbclient";

/**
 * Delete query.
 *
 * Usage:
 *  let sql: string = new DeleteQuery().from("xx").where("a=c").build();
 */
export class DeleteQuery extends Query {
  table_: string;
  where_: string;

  type(): QueryType {
    return QueryType.DELETE;
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
}
