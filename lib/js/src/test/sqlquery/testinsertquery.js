"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const chai = require('chai');
const insertquery_1 = require('../../sqlquery/insertquery');
const model_1 = require('../../base/model');
const decorator_1 = require('../../base/decorator');
let User = class User extends model_1.Model {
    initAsNewUser(username, displayName, age) {
        this.username = username;
        this.displayName = displayName;
        this.age = age;
    }
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
    decorator_1.Column('age', model_1.SqlType.INT, model_1.SqlFlag.NULLABLE)
], User.prototype, "age", void 0);
User = __decorate([
    decorator_1.TableName('users')
], User);
describe('Test insert query', () => {
    it('insert语句过滤属性为空的sql', () => {
        let user = new User();
        user.initAsNewUser('pig');
        const sql = new insertquery_1.InsertQuery().fromModel(user).build();
        chai.expect(sql).to.equal(`INSERT INTO users (username) VALUES ('pig') RETURNING uid`);
    });
});

//# sourceMappingURL=testinsertquery.js.map
