import * as chai from 'chai';

import {InsertQuery} from '../../sqlquery/insertquery';
import {SqlType, Model, SqlFlag} from '../../base/model';
import {TableName, Column} from '../../base/decorator';

@TableName('users')
class User extends Model {

  @Column('uid', SqlType.INT, SqlFlag.PRIMARY_KEY)
  uid: number;

  @Column('username', SqlType.VARCHAR, SqlFlag.NOT_NULL)
  username: string;

  @Column('display_name', SqlType.VARCHAR, SqlFlag.NULLABLE)
  displayName: string;

  @Column('age', SqlType.INT, SqlFlag.NULLABLE)
  age: number;

  initAsNewUser(username: string,  displayName?: string, age?: number) {
    this.username = username;
    this.displayName = displayName;
    this.age = age;
  }
}

describe('Test insert query', () => {
  it('insert语句过滤属性为空的sql', () => {
    let user: User = new User();
    user.initAsNewUser('pig');
    const sql: string = new InsertQuery().fromModel(user).build();
    chai.expect(sql).to.equal(`INSERT INTO users (username) VALUES ('pig') RETURNING uid`);
  });
});
