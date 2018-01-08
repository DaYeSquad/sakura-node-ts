// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Model, SqlType, SqlFlag, SqlDefaultValue} from "./model";
import {sqlContext} from "../util/sqlcontext";
import {GGModel} from "../gg/ggmodel";

export interface ColumnParameters {
  name: string;
  type: SqlType;
  flag: SqlFlag;
  comment?: string;
  defaultValue?: SqlDefaultValue;
}

/**
 * Class decorator for defining a table name, the class should inherits from {@link Model}.
 * @param name Table name.
 */
export function TableName(name: string): Function {
  return function(target: Function) {
    if (target.prototype instanceof Model) {
      sqlContext.addSqlTableRelation({target: target, name: name});

      if (target.prototype instanceof GGModel) {
        // 如果该类继承自 GGModel，则自动加入 created_at, updated_at 以及 is_deleted
        sqlContext.addSqlField(target.prototype.constructor,
          { name: "createdAt",
            columnName: GGModel.CREATED_AT_COLUMN_PARAM.name,
            type: GGModel.CREATED_AT_COLUMN_PARAM.type,
            flag: GGModel.CREATED_AT_COLUMN_PARAM.flag,
            comment: GGModel.CREATED_AT_COLUMN_PARAM.comment
          });

        sqlContext.addSqlField(target.prototype.constructor,
          { name: "updatedAt",
            columnName: GGModel.UPDATED_AT_COLUMN_PARAM.name,
            type: GGModel.UPDATED_AT_COLUMN_PARAM.type,
            flag: GGModel.UPDATED_AT_COLUMN_PARAM.flag,
            comment: GGModel.UPDATED_AT_COLUMN_PARAM.comment
          });

        sqlContext.addSqlField(target.prototype.constructor,
          { name: "isDeleted",
            columnName: GGModel.IS_DELETED_COLUMN_PARAM.name,
            type: GGModel.IS_DELETED_COLUMN_PARAM.type,
            flag: GGModel.IS_DELETED_COLUMN_PARAM.flag,
            comment: GGModel.IS_DELETED_COLUMN_PARAM.comment
          });
      }
    }
  };
}

/**
 * Property decorator for defining column name, the target should inherits from {@link Model}.
 * @param parameters Parameters of column
 */
export function Column(parameters: ColumnParameters): Function;

/**
 * Property decorator for defining column name, the target should inherits from {@link Model}.
 * @param name Column name.
 * @param type Column type.
 * @param flag Some other indicator.
 * @param comment Comment of column.
 * @param defaultValue Default value of column.
 */
export function Column(name: string, type: SqlType, flag: SqlFlag, comment?: string, defaultValue?: SqlDefaultValue): Function;

export function Column(interfaceOrName: any, type?: SqlType, flag?: SqlFlag, comment?: string, defaultValue?: SqlDefaultValue): Function {
  if (type !== undefined && type !== null) { // passing parameters in sequence
    const columnName: string = interfaceOrName;
    return function (target: Object, propertyName: string) {
      if (target instanceof Model) {
        sqlContext.addSqlField(target.constructor,
          { name: propertyName, columnName: columnName, type: type, flag: flag, comment: comment, defaultValue: defaultValue });
      }
    };
  } else { // use interface as parameter
    const p: ColumnParameters = interfaceOrName;
    return function (target: Object, propertyName: string) {
      if (target instanceof Model) {
        sqlContext.addSqlField(target.constructor,
          { name: propertyName, columnName: p.name, type: p.type, flag: p.flag, comment: p.comment, defaultValue: p.defaultValue });
      }
    };
  }
}
