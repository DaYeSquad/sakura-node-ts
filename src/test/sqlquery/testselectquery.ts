// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from 'chai';

import {SelectQuery} from '../../sqlquery/selectquery';
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

  @Column('meta', SqlType.JSON, SqlFlag.NULLABLE)
  meta: any;

  @Column('created_at', SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  createdAt: Date;

  @Column('updated_at', SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  updatedAt: number;
}

describe('SelectQuery', () => {

  it('查询语句 添加JOIN USING 查询全部属性', () => {

    const sql: string = new SelectQuery().fromClass(User).select().joinUsing(`join enterprise_relationships using(uid)`)
                                                         .joinUsing(`join enterprises using(enterprise_id)`).where(` enterprises.enterprise_id = ${115237134}`).build();
    chai.expect(sql).to.equal(`SELECT * FROM users join enterprise_relationships using(uid)  join enterprises using(enterprise_id)  WHERE  enterprises.enterprise_id = 115237134`);
  });

  it('查询语句 添加JOIN USING 查询部分属性', () => {

    const sql: string = new SelectQuery().fromClass(User).select(['users.username', 'enterprises.enterprise_id']).joinUsing(`join enterprise_relationships using(uid)`)
      .joinUsing(`join enterprises using(enterprise_id)`).where(` enterprises.enterprise_id = ${115237134}`).build();
    chai.expect(sql).to.equal(`SELECT users.username,enterprises.enterprise_id FROM users join enterprise_relationships using(uid)  join enterprises using(enterprise_id)  WHERE  enterprises.enterprise_id = 115237134`);
  });
});

