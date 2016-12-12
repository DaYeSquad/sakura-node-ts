// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from 'chai';

import {Migration} from '../../migration/migration';
import {TableName, Column} from '../../base/decorator';
import {Model, SqlType, SqlFlag} from '../../base/model';

@TableName('users')
class User extends Model {
  @Column('uid', SqlType.INT, SqlFlag.PRIMARY_KEY)
  uid: number;

  @Column('username', SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;

  @Column('display_name', SqlType.VARCHAR_255, SqlFlag.NULLABLE)
  displayName: string;

  @Column('meta', SqlType.JSON, SqlFlag.NULLABLE)
  meta: any;

  @Column('created_at', SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  createdAt: Date;

  @Column('updated_at', SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  updatedAt: number;
}

describe('Test Migration', () => {
  it('Test Migration.addModel', () => {
    const expectSql: string = `CREATE TABLE users (
uid INTEGER PRIMARY KEY,
username VARCHAR(255),
display_name VARCHAR(255),
meta JSON,
created_at TIMESTAMP,
updated_at TIMESTAMP
);`;

    let migration: Migration = new Migration();
    migration.addModel(User);
    chai.expect(migration.preview()).to.equal(expectSql);
  });

  it('Test Migration.addColumn without default value', () => {
    const expectSql: string = `ALTER TABLE users ADD COLUMN alias VARCHAR(255);`;

    let migration: Migration = new Migration();
    migration.addColumn(User, {name: 'alias', type: SqlType.VARCHAR_255, flag: SqlFlag.NULLABLE});
    chai.expect(migration.preview()).to.equal(expectSql);
  });

  it('Test Migration.dropColumn', () => {
    const expectSql: string = `ALTER TABLE users DROP COLUMN IF EXISTS alias;`;

    let migration: Migration = new Migration();
    migration.dropColumn(User, 'alias');
    chai.expect(migration.preview()).to.equal(expectSql);
  });

  it('Test Migration.renameColumn', () => {
    const expectSql: string = `ALTER TABLE users RENAME COLUMN display_name TO display_name2;`;

    let migration: Migration = new Migration();
    migration.renameColumn(User, 'display_name', 'display_name2');
    chai.expect(migration.preview()).to.equal(expectSql);
  });
});
