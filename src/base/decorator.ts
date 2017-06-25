// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Model, SqlType, SqlFlag, SqlDefaultValue} from "./model";
import {sqlContext} from "../util/sqlcontext";

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
  if (type!== undefined && type !== null) { // passing parameters in sequence
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
