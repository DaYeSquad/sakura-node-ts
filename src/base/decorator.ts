// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Model, SqlType, SqlFlag} from './model';
import {sqlContext} from '../util/sqlcontext';

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
 * @param name Column name.
 * @param type Column type.
 * @param flag Some other indicator.
 */
export function Column(name: string, type: SqlType, flag: SqlFlag): Function {
  return function (target: Object, propertyName: string) {
    if (target instanceof Model) {
      sqlContext.addSqlField(target.constructor,
        { name: propertyName, columnName: name, type: type, flag: flag });
    }
  };
}
