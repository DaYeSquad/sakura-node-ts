// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Model} from "../base/model";
import {sqlContext} from "../util/sqlcontext";
import {ModelSqlInfo, SqlQuery} from "./sqlquery";

/**
 * Builds insert sql query.
 */
export class InsertQuery {
  private model_: Model;
  private returnId_: boolean = true;

  fromModel(model: Model): this {
    this.model_ = model;
    return this;
  }

  returnId(b: boolean): this {
    this.returnId_ = b;
    return this;
  }

  build(): string {
    if (this.model_) {
      let modelSqlInfo: ModelSqlInfo = SqlQuery.getSqlInfoFromDefinition(this.model_);

      let primaryKey: string = modelSqlInfo.primaryKey;
      let keys: Array<string> = modelSqlInfo.keys;
      let values: Array<string> = modelSqlInfo.values;

      const keysStr: string = keys.join(',');
      const valuesStr: string = values.join(',');

      const tableName: string = sqlContext.findTableByClass(this.model_.constructor);

      if (this.returnId_ && primaryKey) {
        return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr}) RETURNING ${primaryKey}`;
      }

      return `INSERT INTO ${tableName} (${keysStr}) VALUES (${valuesStr})`;
    }
    return "";
  }
}
