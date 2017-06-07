// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {Migration} from "../../migration/migration";
import {SqlType, SqlFlag} from "../../base/model";
import {User} from "../model/user";


describe("Test Migration", () => {
  it("Test Migration.addModel", () => {
    const expectSql: string = `CREATE TABLE IF NOT EXISTS users (
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

    let migration: Migration = new Migration(1, undefined);
    migration.addModel(User);

    chai.expect(migration.preview()).to.equal(expectSql);
  });

  it("Test Migration.addColumn without default value", () => {
    const expectSql: string = `ALTER TABLE users ADD COLUMN alias VARCHAR(255);`;

    let migration: Migration = new Migration(1, undefined);
    migration.addColumn(User, {name: "alias", type: SqlType.VARCHAR_255, flag: SqlFlag.NULLABLE});
    chai.expect(migration.preview()).to.equal(expectSql);
  });

  it("Test Migration.dropColumn", () => {
    const expectSql: string = `ALTER TABLE users DROP COLUMN IF EXISTS alias;`;

    let migration: Migration = new Migration(1, undefined);
    migration.dropColumn(User, "alias");
    chai.expect(migration.preview()).to.equal(expectSql);
  });

  it("Test Migration.renameColumn", () => {
    const expectSql: string = `ALTER TABLE users RENAME COLUMN display_name TO display_name2;`;

    let migration: Migration = new Migration(1, undefined);
    migration.renameColumn(User, "display_name", "display_name2");
    chai.expect(migration.preview()).to.equal(expectSql);
  });

  it("Test Migration.resetColumnType", () => {
    const expectSql: string = `ALTER TABLE users ALTER uid TYPE BIGINT;`;

    let migration: Migration = new Migration(1, undefined);
    migration.resetColumnType(User, "uid", SqlType.BIGINT);
    chai.expect(migration.preview()).to.equal(expectSql);
  });
});
