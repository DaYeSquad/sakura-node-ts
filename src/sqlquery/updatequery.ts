// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";
import {Model, SqlField, SqlFlag, SqlType} from "../base/model";
import {DateFormatter, DateFormtOption} from "../util/dateformatter";
import {isDate} from "util";
import {isNumber} from "util";
import {Query, QueryType} from "./query";
import {DBClient} from "../database/dbclient";

/**
 * Update query.
 *
 * Usage:
 *  1) build from raw
 *  let query: UpdateQuery = new UpdateQuery();
 *  query.tableNameFromClass(cls).set("kind", "Dramatic").where(`kind="Drama"`);
 *
 *  The above will be "UPDATE films SET kind = "Dramatic" WHERE kind = "Drama";"
 *
 *  2) build from model
 *  let query: UpdateQuery = new UpdateQuery();
 *  query.fromModel(modelInstance).where("uid=19900106").build();
 *
 *  The above will read table name and key-values from model.
 */
export class UpdateQuery extends Query {
  table_: string;
  where_: string;
  updates_: { key: string, value: any }[] = [];

  model_: Model;
  setValuesSqlFromModel_: string;

  type(): QueryType {
    return QueryType.UPDATE;
  }

  table(name: string): this {
    this.table_ = name;
    return this;
  }

  tableNameFromClass(cls: Function): this {
    let table: string = sqlContext.findTableByClass(cls);
    if (table) {
      this.table_ = table;
    }
    return this;
  }

  set(key: string, value: any): this {
    this.updates_.push({key: key, value: value});
    return this;
  }

  fromModel(model: Model): this {
    this.model_ = model;
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
}
