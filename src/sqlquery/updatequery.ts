// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";
import {Model, SqlField, SqlFlag, SqlType} from "../base/model";
import {DateFormatter, DateFormtOption} from "../util/dateformatter";

/**
 * Update query.
 *
 * Usage:
 *  1) build from raw
 *  let query: UpdateQuery = new UpdateQuery();
 *  query.tableNameFromClass(cls).set('kind', 'Dramatic').where(`kind='Drama'`);
 *
 *  The above will be 'UPDATE films SET kind = 'Dramatic' WHERE kind = 'Drama';'
 *
 *  2) build from model
 *  let query: UpdateQuery = new UpdateQuery();
 *  query.fromModel(modelInstance).where('uid=19900106').build();
 *
 *  The above will read table name and key-values from model.
 */
export class UpdateQuery {
  private table_: string;
  private where_: string;
  private updates_: {key: string, value: any}[] = [];

  private model_: Model;
  private setValuesSqlFromModel_: string;

  table(name: string): this {
    this.table_ = name;
    return this;
  }

  tableNameFromClass(cls: Function): this {
    let table: string = sqlContext.findTableByClass(cls);
    if (table) {
      this.table_ = table;
    }
    return this;
  }

  set(key: string, value: any): this {
    this.updates_.push({key: key, value: value});
    return this;
  }

  fromModel(model: Model): this {
    this.model_ = model;

    let updatesAry: string[] = [];
    const sqlDefinitions: Array<SqlField> = sqlContext.findSqlFields(this.model_.constructor);

    for (let sqlField of sqlDefinitions) {
      if (sqlField.flag === SqlFlag.PRIMARY_KEY) {
        // default ignore primary key to keys array
      } else if (sqlField.name) {
        let key: string = sqlField.columnName;
        let value: any = this.model_[sqlField.name];
        if(value){
          if (sqlField.type === SqlType.VARCHAR || sqlField.type === SqlType.TEXT) {
            value = `'${value}'`;
          } else if (sqlField.type === SqlType.DATE) {
            let valueAsDateInSql: string = DateFormatter.stringFromDate(value, DateFormtOption.YEAR_MONTH_DAY, '-');
            value = `'${valueAsDateInSql}'::date`;
          } else if (sqlField.type === SqlType.TIMESTAMP) {
            value = `to_timestamp(${value})`;
          }else if (sqlField.type === SqlType.JSON) {
            if (typeof value === 'string') {
              value = `'${value}'::json`;
            } else {
              value = `'${JSON.stringify(value)}'::json`;
            }
          }
          updatesAry.push(`${key}=${value}`);
        }
      }
    }

    this.tableNameFromClass(this.model_.constructor);
    this.setValuesSqlFromModel_ = updatesAry.join(',');
    return this;
  }

  where(...args: any[]): this {
    this.where_ = args.join(' AND ');
    return this;
  }

  build(): string {
    if (this.model_) {
      return `UPDATE ${this.table_} SET ${this.setValuesSqlFromModel_} WHERE ${this.where_};`;
    } else {
      let updatesAry: string[] = [];
      this.updates_.forEach((update: {key: string, value: any}) => {
        if (typeof(update.value) === 'string') {
          updatesAry.push(`${update.key}='${update.value}'`);
        } else {
          updatesAry.push(`${update.key}=${update.value}`);
        }
      });

      const updates: string = updatesAry.join(',');
      return `UPDATE ${this.table_} SET ${updates} WHERE ${this.where_};`;
    }
  }
}