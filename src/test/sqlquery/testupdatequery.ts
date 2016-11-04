// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {UpdateQuery} from "../../sqlquery/updatequery";
import {TableName} from "../../base/decorator";
import {Model} from "../../base/model";

@TableName('users')
class User extends Model {}

describe('UpdateQuery', () => {
  it('UpdateQuery with one set and where', () => {
    const sql: string = new UpdateQuery().table('films').set('kind', 'Dramatic').where(`kind='Drama'`).build();
    chai.expect(sql).to.equal(`UPDATE films SET kind='Dramatic' WHERE kind='Drama';`);
  });

  it('UpdateQuery table name from class', () => {
    const sql: string = new UpdateQuery().tableNameFromClass(User).set('kind', 'Dramatic').where(`kind='Drama'`).build();
    chai.expect(sql).to.equal(`UPDATE users SET kind='Dramatic' WHERE kind='Drama';`);
  });
});