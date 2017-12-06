// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {DriverOptions, DriverType} from "../../database/driveroptions";

import {TableName, Column} from "../../base/decorator";
import {Model, SqlType, SqlFlag} from "../../base/model";
import {Migration} from "../../database/migration/migration";
import {DBClient} from "../../database/dbclient";
import {SelectQuery} from "../../sqlquery/selectquery";
import {QueryResult} from "../../database/queryresult";
import {logError, logInfo} from "../../util/logger";

@TableName("users")
export class User extends Model {
  @Column("uid", SqlType.INT, SqlFlag.PRIMARY_KEY, "主键")
  uid: number;

  @Column("username", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;

  @Column("display_name", SqlType.VARCHAR_255, SqlFlag.NULLABLE, "真实姓名")
  displayName: string;

  @Column("meta", SqlType.JSON, SqlFlag.NULLABLE)
  meta: any;

  @Column("created_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  createdAt: Date;

  @Column("updated_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  updatedAt: number;
}

(async () => {
  try {
    const driverOptions: DriverOptions = {
      type: DriverType.MYSQL,
      username: "root",
      password: "111111",
      database: "gago",
      clusterOptions: {
        master: {
          host: "172.169.21.48"
        },
        slaves: [
          {
            host: "172.169.21.49"
          },
          {
            host: "172.169.21.50"
          }
        ]
      }
    };

    // 使用 Migration 新建 users 表
    let migration: Migration = new Migration({
      version: 7,
      appName: "api-server-6",
      driverOptions: driverOptions
    });

    migration.addModel(User);

    await migration.migrate();

    // 创建 DBClient 全局单例
    DBClient.createClient(driverOptions);

    const fetchUsersQuery: SelectQuery = new SelectQuery().fromClass(User).select();
    const result: QueryResult = await DBClient.getClient().query(fetchUsersQuery);
    logInfo(`there are ${result.rows.length} users`);
  } catch (err) {
    logError(err);
  }
})();
