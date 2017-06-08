// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";
import {Column, TableName} from "../../../base/decorator";
import {Model, SqlDefaultValue, SqlFlag, SqlType} from "../../../base/model";
import {timestamp} from "../../../base/typedefines";
import {DateUtil} from "../../../util/dateutil";
import {InsertQuery} from "../../../sqlquery/insertquery";
import {PgDriver} from "../../../database/postgres/pgdriver";
import {DriverType} from "../../../database/driveroptions";
import {UpdateQuery} from "../../../sqlquery/updatequery";
import {PgQueryBuilder} from "../../../database/postgres/pgquerybuilder";

export enum TransactionAction {
  BUY = 0,
  SELL
}

@TableName("transactions")
export class Transaction extends Model {

  @Column("id", SqlType.INT, SqlFlag.PRIMARY_KEY, "交易的唯一标识", SqlDefaultValue.SERIAL())
  private id_: number;

  @Column("uid", SqlType.INT, SqlFlag.NOT_NULL, "用户ID")
  uid: number;

  @Column("stock_id", SqlType.VARCHAR_255, SqlFlag.NOT_NULL, "股票代码")
  stockId: string;

  @Column("action_type", SqlType.INT, SqlFlag.NOT_NULL)
  actionType: number;

  @Column("position", SqlType.INT, SqlFlag.NOT_NULL)
  position: number;

  @Column("position_sizing", SqlType.INT, SqlFlag.NOT_NULL)
  positionSizing: number;

  @Column("broker_id", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  brokerId: string;

  @Column("action_date", SqlType.TIMESTAMP, SqlFlag.NOT_NULL)
  actionTimestamp: number;

  init(uid: number, stockId: string, actionType: number, position: number, positionSizing: number,
       brokerId: string, actionTimestamp: number) {
    this.uid = uid;
    this.stockId = stockId;
    this.actionType = actionType;
    this.position = position;
    this.positionSizing = positionSizing;
    this.brokerId = brokerId;
    this.actionTimestamp = actionTimestamp;
  }
}

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

describe("PgDriver (issues)", () => {
  
  let queryBuilder: PgQueryBuilder = new PgQueryBuilder();

  it("Transaction should have action_type in insert query while action_type=0", () => {
    const fakeUid: number = 1024;
    const fakeTimestamp: timestamp = DateUtil.millisecondToTimestamp(new Date("2016-10-15T10:46:58.000Z").getTime());

    const transaction: Transaction = new Transaction();
    transaction.init(fakeUid, "SZ000333", 0, 2611, 100, "xnzq", fakeTimestamp);
    transaction.actionType = 0;

    const query: InsertQuery = new InsertQuery().fromModel(transaction);
    const sql: string = queryBuilder.buildInsertQuery(query);
    const expectSql: string =
      `INSERT INTO transactions (uid,stock_id,action_type,position,position_sizing,broker_id,action_date) VALUES (1024,'SZ000333',0,2611,100,'xnzq',to_timestamp(1476528418)) RETURNING id`;
    chai.expect(sql).to.equal(expectSql);
  });

  it("Stock update sql should include carryingCost and dilutedCost while they are equal to 0", () => {
    let stock: Stock = new Stock();
    stock.init(19900106, "SZ000333", 0, 0, 0, 0, 0);
    const query: UpdateQuery = new UpdateQuery().fromModel(stock).where(`stock_id='${stock.stockId}'`, `uid=${stock.uid}`);
    const sql: string = queryBuilder.buildUpdateQuery(query);
    const expectSql: string = `UPDATE stocks SET stock_id='SZ000333',uid=19900106,diluted_cost=0,carrying_cost=0,sizing=0,expect_out=0,expect_in=0 WHERE stock_id='SZ000333' AND uid=19900106;`;

    chai.expect(sql).to.equal(expectSql);
  });
});
