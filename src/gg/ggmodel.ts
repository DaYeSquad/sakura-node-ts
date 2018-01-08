// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {timestamp} from "../base/typedefines";
import {ColumnParameters} from "../base/decorator";
import {Model, SqlFlag, SqlType} from "../base/model";

/**
 * 如果期望类在创建的时候自带 created_at, updated_at 和 is_deleted，可以继承自该类
 */
export class GGModel extends Model {

  static CREATED_AT_COLUMN_PARAM: ColumnParameters = {
    name: "created_at",
    type: SqlType.TIMESTAMP,
    flag: SqlFlag.NOT_NULL,
    comment: "创建时间"
  };

  static UPDATED_AT_COLUMN_PARAM: ColumnParameters = {
    name: "updated_at",
    type: SqlType.TIMESTAMP,
    flag: SqlFlag.NOT_NULL,
    comment: "修改时间"
  };

  static IS_DELETED_COLUMN_PARAM: ColumnParameters = {
    name: "is_deleted",
    type: SqlType.BOOLEAN,
    flag: SqlFlag.NOT_NULL,
    comment: "是否被删除"
  };

  createdAt: timestamp;

  updatedAt: timestamp;

  isDeleted: boolean;
}
