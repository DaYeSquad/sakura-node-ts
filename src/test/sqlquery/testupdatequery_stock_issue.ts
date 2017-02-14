// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {TableName, Column} from "../../base/decorator";
import {Model, SqlType, SqlFlag} from "../../base/model";
import {UpdateQuery} from "../../sqlquery/updatequery";

@TableName("stocks")
export class Stock extends Model {

  @Column("stock_id", SqlType.VARCHAR_255, SqlFlag.NOT_NULL, "股票代码，如 SZ000333")
  stockId: string;

  @Column("uid", SqlType.INT, SqlFlag.NOT_NULL, "用户 ID")
  uid: number;

  @Column("diluted_cost", SqlType.INT, SqlFlag.NOT_NULL, "摊薄成本")
  dilutedCost: number; // in RMB fen.

  @Column("carrying_cost", SqlType.INT, SqlFlag.NOT_NULL, "持仓成本")
  carryingCost: number; // in RMB fen.

  @Column("sizing", SqlType.INT, SqlFlag.NOT_NULL, "持仓数")
  sizing: number; // in unit share.

  @Column("expect_out", SqlType.INT, SqlFlag.NOT_NULL, "期望卖出价格(单位:分)")
  expectOut: number = 0; // in RMB fen.

  @Column("expect_in", SqlType.INT, SqlFlag.NOT_NULL, "期望买进价格(单位:分)")
  expectIn: number = 0; // in RMB fen.

  init(uid: number, stockId: string, dilutedCost: number, carryingCost: number, sizing: number, expectOut?: number, expectIn?: number): void {
    this.uid = uid;
    this.stockId = stockId;
    this.dilutedCost = dilutedCost;
    this.carryingCost = carryingCost;
    this.sizing = sizing;
    if (expectIn) this.expectIn = expectIn;
    if (expectOut) this.expectOut = expectOut;
  }
}

describe("Test UpdateQuery (issues)", () => {
  let stock: Stock = new Stock();
  stock.init(19900106, "SZ000333", 0, 0, 0, 0, 0);

  it("Stock update sql should include carryingCost and dilutedCost while they are equal to 0", () => {
    const sql: string = new UpdateQuery().fromModel(stock).where(`stock_id='${stock.stockId}'`, `uid=${stock.uid}`).build();

    const expectSql: string = `UPDATE stocks SET stock_id='SZ000333',uid=19900106,diluted_cost=0,carrying_cost=0,sizing=0,expect_out=0,expect_in=0 WHERE stock_id='SZ000333' AND uid=19900106;`;

    chai.expect(sql).to.equal(expectSql);
  });
});
