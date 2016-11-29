"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const chai = require('chai');
const updatequery_1 = require('../../sqlquery/updatequery');
const decorator_1 = require('../../base/decorator');
const model_1 = require('../../base/model');
let User = class User extends model_1.Model {
};
__decorate([
    decorator_1.Column('uid', model_1.SqlType.INT, model_1.SqlFlag.PRIMARY_KEY)
], User.prototype, "uid", void 0);
__decorate([
    decorator_1.Column('username', model_1.SqlType.VARCHAR, model_1.SqlFlag.NOT_NULL)
], User.prototype, "username", void 0);
__decorate([
    decorator_1.Column('display_name', model_1.SqlType.VARCHAR, model_1.SqlFlag.NULLABLE)
], User.prototype, "displayName", void 0);
User = __decorate([
    decorator_1.TableName('users')
], User);
describe('UpdateQuery', () => {
    it('UpdateQuery with one set and where', () => {
        const sql = new updatequery_1.UpdateQuery().table('films').set('kind', 'Dramatic').where(`kind='Drama'`).build();
        chai.expect(sql).to.equal(`UPDATE films SET kind='Dramatic' WHERE kind='Drama';`);
    });
    it('UpdateQuery table name from class', () => {
        const sql = new updatequery_1.UpdateQuery().tableNameFromClass(User).set('kind', 'Dramatic').where(`kind='Drama'`).build();
        chai.expect(sql).to.equal(`UPDATE users SET kind='Dramatic' WHERE kind='Drama';`);
    });
    it('更新语句添加set 过滤属性值为空的属性', () => {
        let user = new User();
        user.uid = 1;
        user.username = "hello";
        const sql = new updatequery_1.UpdateQuery().fromModel(user).where(` uid = ${user.uid}`).build();
        chai.expect(sql).to.equal(`UPDATE users SET username='hello' WHERE  uid = 1;`);
    });
});

//# sourceMappingURL=testupdatequery.js.map
