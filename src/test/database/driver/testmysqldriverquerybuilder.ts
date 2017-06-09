// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {MySqlQueryBuilder} from "../../../database/mysql/mysqlquerybuilder";
import {Version} from "../../../database/migration/version";
import {AddModelOperation} from "../../../database/migration/operation";

describe("MySQL Query Builder", () => {

  let queryBuilder: MySqlQueryBuilder = new MySqlQueryBuilder();

  it("Test buildAddModelOperation", () => {
    const expectSql: string = `CREATE TABLE IF NOT EXISTS \`version\` (
id INT AUTO_INCREMENT, -- 唯一编码
\`version\` INT, -- 版本号
\`app_name\` VARCHAR(255) -- 应用名称
,
PRIMARY KEY (\`id\`));`;
    const addModelOperation: AddModelOperation = new AddModelOperation(Version);
    const sql: string = queryBuilder.buildAddModelOperation(addModelOperation);
    chai.expect(sql).to.equal(expectSql);
  });
});
