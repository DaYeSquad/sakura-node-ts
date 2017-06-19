// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {TableName, Column} from "../../base/decorator";
import {Model, SqlType, SqlFlag} from "../../base/model";
import {UpdateQuery} from "../../sqlquery/updatequery";

@TableName("lands")
export class Land extends Model {

  @Column("id", SqlType.NUMERIC, SqlFlag.NOT_NULL, "地块 ID")
  id: number;

  @Column("name", SqlType.VARCHAR_255, SqlFlag.NULLABLE, "地块名称")
  name: string;

  @Column("area", SqlType.INT, SqlFlag.NULLABLE, "面积")
  area: number; // mu.

  @Column("meta", SqlType.JSON, SqlFlag.NULLABLE, "备注")
  meta: any;

  @Column("create_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE, "创建时间")
  createAt: number;

  @Column("update_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE, "更新时间")
  updateAt: number;


  init( name: string, area: number, meta: any, createAt: number, updateAt: number): void {
    this.name = name;
    this.area = area;
    this.meta = meta;
    this.createAt = createAt;
    this.updateAt = updateAt;
  }
}

describe("Test UpdateQuery (issues: 'null' string)", () => {


  it("when get null value sql-string value shoule be null regardless 'null' ext ", () => {
    let land: Land = new Land();
    land.init(null, null, null, null, null);

    const sql: string = new UpdateQuery().fromModel(land).where(`id=${123}`).build();

    const expectSql: string = `UPDATE lands SET name=NULL,area=NULL,meta=NULL,create_at=NULL,update_at=NULL WHERE id=123;`;

    chai.expect(sql).to.equal(expectSql);
  });

  it("when get valid value sql-string value shoule be valid value", () => {
    let land: Land = new Land();
    const name: string = 'baozha';
    const area: number = 531;
    const meta = { time: '2017-05-23', score: 98};
    const now: number = Math.floor(new Date().getTime() / 1000);
    land.init('baozha', area, meta, null, now);

    const sql: string = new UpdateQuery().fromModel(land).where(`id=${123}`).build();

    const expectSql: string = `UPDATE lands SET name='${name}',area=${area},meta='${JSON.stringify(meta)}'::json,create_at=NULL,update_at=to_timestamp(${now}) WHERE id=123;`;

    chai.expect(sql).to.equal(expectSql);
  });
});
