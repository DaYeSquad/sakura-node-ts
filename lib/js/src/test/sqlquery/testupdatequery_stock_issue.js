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
const updatequery_1 = require("../../sqlquery/updatequery");
let Stock = class Stock extends model_1.Model {
    constructor() {
        super(...arguments);
        this.expectOut = 0;
        this.expectIn = 0;
    }
    init(uid, stockId, dilutedCost, carryingCost, sizing, expectOut, expectIn) {
        this.uid = uid;
        this.stockId = stockId;
        this.dilutedCost = dilutedCost;
        this.carryingCost = carryingCost;
        this.sizing = sizing;
        if (expectIn)
            this.expectIn = expectIn;
        if (expectOut)
            this.expectOut = expectOut;
    }
};
__decorate([
    decorator_1.Column('stock_id', model_1.SqlType.VARCHAR_255, model_1.SqlFlag.NOT_NULL, '股票代码，如 SZ000333')
], Stock.prototype, "stockId", void 0);
__decorate([
    decorator_1.Column('uid', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL, '用户 ID')
], Stock.prototype, "uid", void 0);
__decorate([
    decorator_1.Column('diluted_cost', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL, '摊薄成本')
], Stock.prototype, "dilutedCost", void 0);
__decorate([
    decorator_1.Column('carrying_cost', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL, '持仓成本')
], Stock.prototype, "carryingCost", void 0);
__decorate([
    decorator_1.Column('sizing', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL, '持仓数')
], Stock.prototype, "sizing", void 0);
__decorate([
    decorator_1.Column('expect_out', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL, '期望卖出价格(单位:分)')
], Stock.prototype, "expectOut", void 0);
__decorate([
    decorator_1.Column('expect_in', model_1.SqlType.INT, model_1.SqlFlag.NOT_NULL, '期望买进价格(单位:分)')
], Stock.prototype, "expectIn", void 0);
Stock = __decorate([
    decorator_1.TableName('stocks')
], Stock);
exports.Stock = Stock;
describe('Test UpdateQuery (issues)', () => {
    let stock = new Stock();
    stock.init(19900106, 'SZ000333', 0, 0, 0, 0, 0);
    it('Stock update sql should include carryingCost and dilutedCost while they are equal to 0', () => {
        const sql = new updatequery_1.UpdateQuery().fromModel(stock).where(`stock_id='${stock.stockId}'`, `uid=${stock.uid}`).build();
        const expectSql = `UPDATE stocks SET stock_id='SZ000333',uid=19900106,diluted_cost=0,carrying_cost=0,sizing=0,expect_out=0,expect_in=0 WHERE stock_id='SZ000333' AND uid=19900106;`;
        chai.expect(sql).to.equal(expectSql);
    });
});

//# sourceMappingURL=testupdatequery_stock_issue.js.map
