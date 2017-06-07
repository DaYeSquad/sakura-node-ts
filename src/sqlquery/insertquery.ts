// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Model} from "../base/model";
import {sqlContext} from "../util/sqlcontext";
import {ModelSqlInfo, SqlQuery} from "./sqlquery";
import {Query, QueryType} from "./query";

/**
 * Builds insert sql query.
 */
export class InsertQuery implements Query {
  model_: Model;
  returnId_: boolean = true;

  type(): QueryType {
    return QueryType.INSERT;
  }

  fromModel(model: Model): this {
    this.model_ = model;
    return this;
  }

  returnId(b: boolean): this {
    this.returnId_ = b;
    return this;
  }
}
