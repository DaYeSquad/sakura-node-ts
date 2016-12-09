"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const chai = require('chai');
const selectquery_1 = require('../../sqlquery/selectquery');
const decorator_1 = require('../../base/decorator');
const model_1 = require('../../base/model');
let User = class User extends model_1.Model {
};
__decorate([
    decorator_1.Column('uid', model_1.SqlType.INT, model_1.SqlFlag.PRIMARY_KEY)
], User.prototype, "uid", void 0);
__decorate([
    decorator_1.Column('username', model_1.SqlType.VARCHAR_255, model_1.SqlFlag.NOT_NULL)
], User.prototype, "username", void 0);
__decorate([
    decorator_1.Column('display_name', model_1.SqlType.VARCHAR_255, model_1.SqlFlag.NULLABLE)
], User.prototype, "displayName", void 0);
__decorate([
    decorator_1.Column('meta', model_1.SqlType.JSON, model_1.SqlFlag.NULLABLE)
], User.prototype, "meta", void 0);
__decorate([
    decorator_1.Column('created_at', model_1.SqlType.TIMESTAMP, model_1.SqlFlag.NULLABLE)
], User.prototype, "createdAt", void 0);
__decorate([
    decorator_1.Column('updated_at', model_1.SqlType.TIMESTAMP, model_1.SqlFlag.NULLABLE)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    decorator_1.TableName('users')
], User);
describe('SelectQuery', () => {
    it('查询语句 添加JOIN USING 查询全部属性', () => {
        const sql = new selectquery_1.SelectQuery().fromClass(User).select().joinUsing(`join enterprise_relationships using(uid)`)
            .joinUsing(`join enterprises using(enterprise_id)`).where(` enterprises.enterprise_id = ${115237134}`).build();
        chai.expect(sql).to.equal(`SELECT * FROM users join enterprise_relationships using(uid)  join enterprises using(enterprise_id)  WHERE  enterprises.enterprise_id = 115237134`);
    });
    it('查询语句 添加JOIN USING 查询部分属性', () => {
        const sql = new selectquery_1.SelectQuery().fromClass(User).select(['users.username', 'enterprises.enterprise_id']).joinUsing(`join enterprise_relationships using(uid)`)
            .joinUsing(`join enterprises using(enterprise_id)`).where(` enterprises.enterprise_id = ${115237134}`).build();
        chai.expect(sql).to.equal(`SELECT users.username,enterprises.enterprise_id FROM users join enterprise_relationships using(uid)  join enterprises using(enterprise_id)  WHERE  enterprises.enterprise_id = 115237134`);
    });
});

//# sourceMappingURL=testselectquery.js.map
