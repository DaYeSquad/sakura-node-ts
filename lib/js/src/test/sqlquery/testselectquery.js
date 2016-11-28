"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const chai = require("chai");
const selectquery_1 = require("../../sqlquery/selectquery");
const model_1 = require("../../base/model");
const decorator_1 = require("../../base/decorator");
let User = class User extends model_1.Model {
    initPk(pk) {
        this.uid = pk;
    }
};
__decorate([
    decorator_1.Column('uid', model_1.SqlType.INT, model_1.SqlFlag.PRIMARY_KEY)
], User.prototype, "uid", void 0);
__decorate([
    decorator_1.Column('username', model_1.SqlType.VARCHAR, model_1.SqlFlag.NOT_NULL)
], User.prototype, "username", void 0);
User = __decorate([
    decorator_1.TableName('users')
], User);
let Car = class Car extends model_1.Model {
    initPk(pk) {
        this.cid = pk;
    }
};
__decorate([
    decorator_1.Column('cid', model_1.SqlType.INT, model_1.SqlFlag.PRIMARY_KEY)
], Car.prototype, "cid", void 0);
__decorate([
    decorator_1.Column('username', model_1.SqlType.VARCHAR, model_1.SqlFlag.NOT_NULL)
], Car.prototype, "username", void 0);
Car = __decorate([
    decorator_1.TableName('cars')
], Car);
describe('测试查询语句只添加pk条件', () => {
    it('测试查询语句只添加pk条件', () => {
        let user = new User();
        user.initPk(111);
        const sql = new selectquery_1.SelectQuery().fromClass(User).select().where(user.findPrimaryKeyWhere()).build();
        chai.expect(sql).to.equal(`SELECT * FROM users WHERE  uid = 111 `);
    });
});
describe('测试查询语句添加pk条件和普通where条件', () => {
    it('测试查询语句添加pk条件和普通where条件', () => {
        let car = new Car();
        car.initPk(222);
        const sql = new selectquery_1.SelectQuery().fromClass(Car).select().where(car.findPrimaryKeyWhere()).build();
        chai.expect(sql).to.equal(`SELECT * FROM cars WHERE  cid = 222 `);
    });
});

//# sourceMappingURL=testselectquery.js.map
