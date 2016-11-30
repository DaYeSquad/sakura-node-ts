// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from '../util/sqlcontext';
import {SqlType} from '../base/model';
import {SqlQuery} from './sqlquery';

/**
 * Insert or replace.
 *
 * Usage:
 *  const sql: string = new ReplaceQuery().fromClass(WeatherCacheInfo).where('xx=xx').set(x, y).set(z, c).build();
 *  PgClient.getInstance().query(sql);
 */
export class ReplaceQuery {
  private table_: string;
  private where_: string;
  private newValues_: {key: string, value: any, sqlType: SqlType}[] = [];

  fromClass(cls: Function): this {
    let table: string = sqlContext.findTableByClass(cls);
    if (table) {
      this.table_ = table;
    }
    return this;
  }

  where(...args: any[]): this {
    this.where_ = args.join(' AND ');
    return this;
  }

  set(key: string, value: any, sqlType: SqlType): this {
    this.newValues_.push({key: key, value: value, sqlType: sqlType});
    return this;
  }

  build(): string {
    let keysAry: string[] = [];
    let valuesAry: any[] = [];
    let kvsAry: any[] = [];

    this.newValues_.forEach((kv) => {
      keysAry.push(kv.key);

      let value: string = SqlQuery.valueAsStringByType(kv.value, kv.sqlType);
      valuesAry.push(value);
      kvsAry.push(`${kv.key}=${value}`);
    });

    let keys: string = keysAry.join(',');
    let values: string = valuesAry.join(',');
    let kvs: string = kvsAry.join(',');

    return `UPDATE ${this.table_} SET ${kvs} WHERE ${this.where_};
            INSERT INTO ${this.table_} (${keys})
            SELECT ${values}
            WHERE NOT EXISTS (SELECT 1 FROM ${this.table_} WHERE ${this.where_});`;
  }
}
