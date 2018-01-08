// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Using of this source code is governed a license that can be found in the LICENSE file.

import {timestamp} from "../base/typedefines";
import {ColumnParameters} from "../base/decorator";
import {Model, SqlFlag, SqlType} from "../base/model";

export interface GGModelConfig {
  /**
   * 在调用 InsertQuery 时 created_at 在没有给值的情况下会自动使用当前的时间来赋值
   */
  autoInsertCreatedAtUsingNow: boolean;

  /**
   * 在调用 InsertQuery 时 updated_at 在没有给值的情况下会自动使用当前的时间来赋值
   */
  autoInsertUpdatedAtUsingNow: boolean;

  /**
   * 在调用 UpdateQuery 时 updated_at 在没有给值的情况下会自动使用当前的时间来赋值
   */
  autoUpdateUpdatedAtUsingNow: boolean;
}

/**
 * 如果期望类在创建的时候自带 created_at, updated_at 和 is_deleted，可以继承自该类
 * 另外需要注意的是上方 GGModelConfig 的配置注释
 * 1.
 * 2.在调用 UpdateQuery 时不会自动更新 updated_at
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

  /**
   * 一些 ORM 时期的设置，子类可以通过重载该方法来进行一些控制
   */
  config: GGModelConfig = {
    autoInsertCreatedAtUsingNow: true,
    autoInsertUpdatedAtUsingNow: true,
    autoUpdateUpdatedAtUsingNow: true
  };

  createdAt: timestamp;

  updatedAt: timestamp;

  isDeleted: boolean = false;
}
