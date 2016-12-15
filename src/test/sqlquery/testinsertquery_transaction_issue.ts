// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from 'chai';

import {TableName, Column} from '../../base/decorator';
import {Model, SqlFlag, SqlType, SqlDefaultValue} from '../../base/model';
import {InsertQuery} from '../../sqlquery/insertquery';
import {timestamp} from '../../base/typedefines';
import {DateUtil} from '../../util/dateutil';

export enum TransactionAction {
  BUY = 0,
  SELL
}

@TableName('transactions')
export class Transaction extends Model {

  @Column('id', SqlType.INT, SqlFlag.PRIMARY_KEY, '交易的唯一标识', SqlDefaultValue.SERIAL())
  private id_: number;

  @Column('uid', SqlType.INT, SqlFlag.NOT_NULL, '用户ID')
  uid: number;

  @Column('stock_id', SqlType.VARCHAR_255, SqlFlag.NOT_NULL, '股票代码')
  stockId: string;

  @Column('action_type', SqlType.INT, SqlFlag.NOT_NULL)
  actionType: number;

  @Column('position', SqlType.INT, SqlFlag.NOT_NULL)
  position: number;

  @Column('position_sizing', SqlType.INT, SqlFlag.NOT_NULL)
  positionSizing: number;

  @Column('broker_id', SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  brokerId: string;

  @Column('action_date', SqlType.TIMESTAMP, SqlFlag.NOT_NULL)
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

describe('Test InsertQuery (issues)', () => {
  it('Transaction should have action_type in insert query while action_type=0', () => {
    const fakeUid: number = 1024;
    const fakeTimestamp: timestamp = DateUtil.millisecondToTimestamp(new Date('2016-10-15T10:46:58.000Z').getTime());

    const transaction: Transaction = new Transaction();
    transaction.init(fakeUid, 'SZ000333', 0, 2611, 100, 'xnzq', fakeTimestamp);
    transaction.actionType = 0;

    const sql: string = new InsertQuery().fromModel(transaction).build();
    const expectSql: string =
      `INSERT INTO transactions (uid,stock_id,action_type,position,position_sizing,broker_id,action_date) VALUES (1024,'SZ000333',0,2611,100,'xnzq',to_timestamp(1476528418)) RETURNING id`;
    chai.expect(sql).to.equal(expectSql);
  });
});
