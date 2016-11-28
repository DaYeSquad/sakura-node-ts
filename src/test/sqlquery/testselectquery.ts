//Copyright (c) 2016 (jw872505975@gmail.com). All rights reserved.

import * as chai from "chai";

import { SelectQuery } from "../../sqlquery/selectquery";
import {SqlType, Model, SqlFlag} from "../../base/model";
import {TableName, Column} from "../../base/decorator";

@TableName('users')
class User extends Model {

  @Column('uid', SqlType.INT, SqlFlag.PRIMARY_KEY)
  uid: number;

  @Column('username', SqlType.VARCHAR, SqlFlag.NOT_NULL)
  username: string;

  initPk(pk: number,  ) {
    this.uid = pk;

  }
}

@TableName('cars')
class Car extends Model {

  @Column('cid', SqlType.INT, SqlFlag.PRIMARY_KEY)
  cid: number;

  @Column('username', SqlType.VARCHAR, SqlFlag.NOT_NULL)
  username: string;

  initPk(pk: number,  ) {
    this.cid = pk;

  }
}

describe('测试查询语句只添加pk条件', () => {
  it('测试查询语句只添加pk条件', () => {
    let user: User = new User();
    user.initPk(111);
    const sql: string = new SelectQuery().fromClass(User).select().where(user.findPrimaryKeyWhere()).build();
    chai.expect(sql).to.equal(`SELECT * FROM users WHERE  uid = 111 `);
  });
});

describe('测试查询语句添加pk条件和普通where条件', () => {
  it('测试查询语句添加pk条件和普通where条件', () => {
    let car: Car = new Car();
    car.initPk(222);
    const sql: string = new SelectQuery().fromClass(Car).select().where(car.findPrimaryKeyWhere()).build();
    chai.expect(sql).to.equal(`SELECT * FROM cars WHERE  cid = 222 `);
  });
});