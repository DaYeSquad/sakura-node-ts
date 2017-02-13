// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Model, SqlField, SqlType, SqlFlag} from "../base/model";
import {sqlContext} from "../util/sqlcontext";
import {DateFormatter, DateFormtOption} from "../util/dateformatter";

export interface ModelSqlInfo {
  primaryKey: string;
  keys: Array<string>;
  values: Array<string>;
}

/**
 * Including some utility methods for xxxQuery class.
 */
export class SqlQuery {

  /**
   * Gets model sql definition infos.
   * @param model Model object.
   * @returns {ModelSqlInfo} Result information.
   */
  static getSqlInfoFromDefinition(model: Model): ModelSqlInfo {
    let modelInfo: ModelSqlInfo = {primaryKey: "", keys: [], values: []};

    const sqlDefinitions: Array<SqlField> = sqlContext.findSqlFields(model.constructor);

    for (let sqlField of sqlDefinitions) {
      if (sqlField.flag === SqlFlag.PRIMARY_KEY) {
        modelInfo.primaryKey = sqlField.columnName; // default not pushes primary key to keys array
      } else if (sqlField.name) {
        if (model[sqlField.name] !== undefined) {
          modelInfo.keys.push(sqlField.columnName);
          let value: any = model[sqlField.name];
          value = SqlQuery.valueAsStringByType(value, sqlField.type);
          modelInfo.values.push(value);
        } else  {
          console.log(`value (model[${sqlField.name}]) not found`);
        }
      } else {
        console.log(`Unknown sqlField ${sqlField.name}, ${sqlField.columnName}`);
      }
    }

    return modelInfo;
  }

  static valueAsStringByType(value: any, sqlType: SqlType): string {
    if (sqlType === SqlType.VARCHAR_255 || sqlType === SqlType.TEXT || sqlType === SqlType.VARCHAR_1024) {
      value = `"${value}"`;
    } else if (sqlType === SqlType.DATE) {
      let valueAsDateInSql: string = DateFormatter.stringFromDate(value, DateFormtOption.YEAR_MONTH_DAY, "-");
      value = `"${valueAsDateInSql}"::date`;
    } else if (sqlType === SqlType.TIMESTAMP) {
      value = `to_timestamp(${value})`;
    } else if (sqlType === SqlType.JSON) {
      if (typeof value === "string") {
        value = `"${value}"::json`;
      } else {
        value = `"${JSON.stringify(value)}"::json`;
      }
    } else if (sqlType === SqlType.INT || sqlType === SqlType.BIGINT) {
      value = String(`${value}`);
    } else {
      console.log(`SqlType is ${sqlType}, value is ${value}`);
    }

    return value;
  }
}
