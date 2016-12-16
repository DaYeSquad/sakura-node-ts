"use strict";
const chai = require('chai');
const migration_1 = require('../../migration/migration');
const model_1 = require('../../base/model');
const inittestdb_1 = require('../../migration/inittestdb');
const user_1 = require('../model/user');
describe('Test Migration', () => {
    it('Test Migration.addModel', () => {
        const expectSql = `CREATE TABLE users (
uid INTEGER PRIMARY KEY, --主键
username VARCHAR(255),
display_name VARCHAR(255), --真实姓名
meta JSON,
created_at TIMESTAMP,
updated_at TIMESTAMP
);
COMMENT ON COLUMN users.uid IS '主键';
COMMENT ON COLUMN users.display_name IS '真实姓名';
`;
        let migration = new migration_1.Migration();
        migration.addModel(user_1.User);
        let initTestDb = new inittestdb_1.InitTestDb();
        initTestDb.initAllTableSql();
        initTestDb.save();
        migration.save();
        chai.expect(migration.preview()).to.equal(expectSql);
    });
    it('Test Migration.addColumn without default value', () => {
        const expectSql = `ALTER TABLE users ADD COLUMN alias VARCHAR(255);`;
        let migration = new migration_1.Migration();
        migration.addColumn(user_1.User, { name: 'alias', type: model_1.SqlType.VARCHAR_255, flag: model_1.SqlFlag.NULLABLE });
        chai.expect(migration.preview()).to.equal(expectSql);
    });
    it('Test Migration.dropColumn', () => {
        const expectSql = `ALTER TABLE users DROP COLUMN IF EXISTS alias;`;
        let migration = new migration_1.Migration();
        migration.dropColumn(user_1.User, 'alias');
        chai.expect(migration.preview()).to.equal(expectSql);
    });
    it('Test Migration.renameColumn', () => {
        const expectSql = `ALTER TABLE users RENAME COLUMN display_name TO display_name2;`;
        let migration = new migration_1.Migration();
        migration.renameColumn(user_1.User, 'display_name', 'display_name2');
        chai.expect(migration.preview()).to.equal(expectSql);
    });
});

//# sourceMappingURL=testmigration.js.map
