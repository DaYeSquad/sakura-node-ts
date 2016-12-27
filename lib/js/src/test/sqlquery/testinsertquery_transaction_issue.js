"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const chai = require("chai");
const decorator_1 = require("../../base/decorator");
const model_1 = require("../../base/model");
const insertquery_1 = require("../../sqlquery/insertquery");
const dateutil_1 = require("../../util/dateutil");
var TransactionAction;
(function (TransactionAction) {
    TransactionAction[TransactionAction["BUY"] = 0] = "BUY";
    TransactionAction[TransactionAction["SELL"] = 1] = "SELL";
})(TransactionAction = exports.TransactionAction || (exports.TransactionAction = {}));
let Transaction = class Transaction extends model_1.Model {
    init(uid, stockId, actionType, position, positionSizing, brokerId, actionTimestamp) {
        this.uid = uid;
        this.stockId = stockId;
        this.actionType = actionType;
        this.position = position;
        this.positionSizing = positionSizing;
        this.brokerId = brokerId;
        this.actionTimestamp = actionTimestamp;
    }
};
__decorate([
    decorator_1.Column('id', model_1.SqlType.INT, model_1.SqlFlag.PRIMARY_KEY, '交易的唯一标识', model_1.SqlDefaultValue.SERIAL())
], Transaction.prototype, "id_", void 0);
__decorate([
    decorator_1.Column('uid', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL, '用户ID')
], Transaction.prototype, "uid", void 0);
__decorate([
    decorator_1.Column('stock_id', model_1.SqlType.VARCHAR_255, model_1.SqlFlag.NOT_NULL, '股票代码')
], Transaction.prototype, "stockId", void 0);
__decorate([
    decorator_1.Column('action_type', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL)
], Transaction.prototype, "actionType", void 0);
__decorate([
    decorator_1.Column('position', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL)
], Transaction.prototype, "position", void 0);
__decorate([
    decorator_1.Column('position_sizing', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL)
], Transaction.prototype, "positionSizing", void 0);
__decorate([
    decorator_1.Column('broker_id', model_1.SqlType.VARCHAR_255, model_1.SqlFlag.NOT_NULL)
], Transaction.prototype, "brokerId", void 0);
__decorate([
    decorator_1.Column('action_date', model_1.SqlType.TIMESTAMP, model_1.SqlFlag.NOT_NULL)
], Transaction.prototype, "actionTimestamp", void 0);
Transaction = __decorate([
    decorator_1.TableName('transactions')
], Transaction);
exports.Transaction = Transaction;
describe('Test InsertQuery (issues)', () => {
    it('Transaction should have action_type in insert query while action_type=0', () => {
        const fakeUid = 1024;
        const fakeTimestamp = dateutil_1.DateUtil.millisecondToTimestamp(new Date('2016-10-15T10:46:58.000Z').getTime());
        const transaction = new Transaction();
        transaction.init(fakeUid, 'SZ000333', 0, 2611, 100, 'xnzq', fakeTimestamp);
        transaction.actionType = 0;
        const sql = new insertquery_1.InsertQuery().fromModel(transaction).build();
        const expectSql = `INSERT INTO transactions (uid,stock_id,action_type,position,position_sizing,broker_id,action_date) VALUES (1024,'SZ000333',0,2611,100,'xnzq',to_timestamp(1476528418)) RETURNING id`;
        chai.expect(sql).to.equal(expectSql);
    });
});

//# sourceMappingURL=testinsertquery_transaction_issue.js.map
