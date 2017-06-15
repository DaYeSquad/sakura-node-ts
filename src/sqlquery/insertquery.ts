// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Model} from "../base/model";
import {sqlContext} from "../util/sqlcontext";
import {Query, QueryType} from "./query";

/**
 * Builds insert sql query.
 */
export class InsertQuery extends Query {
  model_: Model;
  table_: string;
  returnId_: boolean = true;
  returnValue_: string = "";
  columns_: string[] = [];
  values_: any[] = [];

  type(): QueryType {
    return QueryType.INSERT;
  }

  fromModel(model: Model): this {
    this.model_ = model;
    return this;
  }

  fromTable(table: string): this {
    this.table_ = table;
    return this;
  }

  set(columns: string[]): this {
    this.columns_ = columns;
    return this;
  }

  value(values: any[]): this {
    this.values_ = values;
    return this;
  }

  returning(returnColumn: string): this {
    this.returnValue_ = returnColumn;
    return this;
  }

  returnId(b: boolean): this {
    this.returnId_ = b;
    return this;
  }
}
