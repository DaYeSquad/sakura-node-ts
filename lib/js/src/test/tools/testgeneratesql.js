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
const sqlgenerator_1 = require("../../tools/sqlgenerator");
let User = class User extends model_1.Model {
};
__decorate([
    decorator_1.Column('uid', model_1.SqlType.INT, model_1.SqlFlag.PRIMARY_KEY, '系统编号，唯一标识', model_1.SqlDefaultValue.MAKE_RANDOM_ID())
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
let Enterprise = class Enterprise extends model_1.Model {
};
__decorate([
    decorator_1.Column('eid', model_1.SqlType.INT, model_1.SqlFlag.PRIMARY_KEY, '系统编号，唯一标识', model_1.SqlDefaultValue.SERIAL())
], Enterprise.prototype, "eid", void 0);
__decorate([
    decorator_1.Column('name', model_1.SqlType.VARCHAR_255, model_1.SqlFlag.NOT_NULL, '企业名')
], Enterprise.prototype, "name", void 0);
Enterprise = __decorate([
    decorator_1.TableName('enterprises')
], Enterprise);
describe('SqlGenerator', () => {
    it('Test generateCreateTableSql with normal model', () => {
        const expectResult = `CREATE TABLE IF NOT EXISTS users (
uid INTEGER PRIMARY KEY DEFAULT make_random_id(), --系统编号，唯一标识
username VARCHAR(255),
display_name VARCHAR(255),
meta JSON,
created_at TIMESTAMP,
updated_at TIMESTAMP
);`;
        const sql = sqlgenerator_1.sqlGenerator.generateCreateTableSql(User);
        chai.expect(sql).to.equal(expectResult);
    });
    it('Test generateCreateTableSql with model whose ID is SERIAL', () => {
        const expectResult = `CREATE TABLE IF NOT EXISTS enterprises (
eid SERIAL, --系统编号，唯一标识
name VARCHAR(255) --企业名
);`;
        const sql = sqlgenerator_1.sqlGenerator.generateCreateTableSql(Enterprise);
        chai.expect(sql).to.equal(expectResult);
    });
});

//# sourceMappingURL=testgeneratesql.js.map
