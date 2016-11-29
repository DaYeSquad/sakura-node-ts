// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from 'chai';

import {UpdateQuery} from '../../sqlquery/updatequery';
import {TableName, Column} from '../../base/decorator';
import {Model, SqlFlag, SqlType} from '../../base/model';


@TableName('users')
class User extends Model {
  @Column('uid', SqlType.INT, SqlFlag.PRIMARY_KEY)
  uid: number;

  @Column('username', SqlType.VARCHAR, SqlFlag.NOT_NULL)
  username: string;

  @Column('display_name', SqlType.VARCHAR, SqlFlag.NULLABLE)
  displayName: string;
}

describe('UpdateQuery', () => {
  it('UpdateQuery with one set and where', () => {
    const sql: string = new UpdateQuery().table('films').set('kind', 'Dramatic').where(`kind='Drama'`).build();
    chai.expect(sql).to.equal(`UPDATE films SET kind='Dramatic' WHERE kind='Drama';`);
  });

  it('UpdateQuery table name from class', () => {
    const sql: string = new UpdateQuery().tableNameFromClass(User).set('kind', 'Dramatic').where(`kind='Drama'`).build();
    chai.expect(sql).to.equal(`UPDATE users SET kind='Dramatic' WHERE kind='Drama';`);
  });

  it('更新语句添加set 过滤属性值为空的属性', () => {
    let user: User = new User();
    user.uid = 1;
    user.username = 'hello';
    const sql: string = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`).build();
    chai.expect(sql).to.equal(`UPDATE users SET username='hello' WHERE  uid = 1;`);
  });
});
