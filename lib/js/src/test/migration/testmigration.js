"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const chai = require('chai');
const migration_1 = require('../../migration/migration');
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
describe('Test Migration', () => {
    it('Test Migration.addModel', () => {
        const expectSql = `CREATE TABLE users (
uid INTEGER PRIMARY KEY,
username VARCHAR(255),
display_name VARCHAR(255),
meta JSON,
created_at TIMESTAMP,
updated_at TIMESTAMP
);`;
        let migration = new migration_1.Migration();
        migration.addModel(User);
        chai.expect(migration.preview()).to.equal(expectSql);
    });
    it('Test Migration.addColumn without default value', () => {
        const expectSql = `ALTER TABLE users ADD COLUMN alias VARCHAR(255);`;
        let migration = new migration_1.Migration();
        migration.addColumn(User, { name: 'alias', type: model_1.SqlType.VARCHAR_255, flag: model_1.SqlFlag.NULLABLE });
        chai.expect(migration.preview()).to.equal(expectSql);
    });
    it('Test Migration.dropColumn', () => {
        const expectSql = `ALTER TABLE users DROP COLUMN IF EXISTS alias;`;
        let migration = new migration_1.Migration();
        migration.dropColumn(User, 'alias');
        chai.expect(migration.preview()).to.equal(expectSql);
    });
    it('Test Migration.renameColumn', () => {
        const expectSql = `ALTER TABLE users RENAME COLUMN display_name TO display_name2;`;
        let migration = new migration_1.Migration();
        migration.renameColumn(User, 'display_name', 'display_name2');
        chai.expect(migration.preview()).to.equal(expectSql);
    });
});

//# sourceMappingURL=testmigration.js.map
