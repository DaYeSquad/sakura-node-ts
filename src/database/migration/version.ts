// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Model, SqlType, SqlFlag, SqlDefaultValue} from "../../base/model";
import {Column, TableName} from "../../base/decorator";

/**
 * Migration version.
 */
@TableName("version")
export class Version extends Model {

  @Column("id", SqlType.INT, SqlFlag.PRIMARY_KEY, "唯一编码", SqlDefaultValue.SERIAL())
  id: number;

  @Column("version", SqlType.INT, SqlFlag.NOT_NULL, "版本号")
  version: number;

  @Column("app_name", SqlType.VARCHAR_255, SqlFlag.NULLABLE, "应用名称")
  appName: string;
}
