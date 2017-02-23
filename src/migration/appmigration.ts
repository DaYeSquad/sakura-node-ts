// Copyright (c) 2016 (jw872505975@gmail.com). All rights reserved.
import * as fs from "fs";
import * as path from "path";

import {PgClient} from "../database/pgclient";
import {Version} from "./version";
import {sqlGenerator} from "../tools/sqlgenerator";
import {Migration} from "./migration";
import {SelectQuery} from "../sqlquery/selectquery";
import {PgQueryResult} from "../base/typedefines";
import {InsertQuery} from "../sqlquery/insertquery";
import {UpdateQuery} from "../sqlquery/updatequery";
import {Model} from "../base/model";

/**
 * Migration tool for PostgreSQL.
 *
 * Usage:
 *  let migration = new Migration();
 *  migration.addModel(User); // Adds User"s table.
 *  migration.migrate(); // migrate database.
 */
export class AppMigration extends Migration {
  protected appName_: string = "";

  /**
   * Init with current migration version, be sure to use INTEGER value.
   * @param version Current version.
   * @param pgClient Postgres connection.
   */
  constructor(version: number, appName: string, pgClient: PgClient) {
    super(version, pgClient);
    this.appName_ = appName;
  }

  /**
   * Returns current version as number or undefined is table not exists.
   * @private
   */
   private async currentVersionNumber_(): Promise<Version | undefined> {
    // create table
    const createTableSql: string = sqlGenerator.generateCreateTableSql(Version);
    await this.pgInstance_.query(createTableSql);

    const sql: string = new SelectQuery().fromClass(Version).select().where(`app_name = '${this.appName_}'`).build();
    const result: PgQueryResult = await this.pgInstance_.query(sql);
    if (result.rows.length > 0) {
      return Model.modelFromRow(result.rows[0], Version);
    } else {
      return undefined;
    }
  }

  /**
   * Executes migrate sql commands, it is highly recommended to use preview() to see sql before use this method.
   */
  async migrate(setupEnv: boolean = false): Promise<void> {
    // init PG
    if (this.pgInstance_ === undefined) {
      throw new Error("UNDEFINED_PG_CLIENT_SHARED_INSTANCE");
    }

    // check version
    const currentVersion: Version | undefined = await this.currentVersionNumber_();
    if (currentVersion === undefined) { // first time to execute query
      let version: Version = new Version();
      version.version = this.version_;
      version.appName = this.appName_;
      const insertSql: string = new InsertQuery().fromModel(version).build();

      await this.pgInstance_.query(insertSql);
    } else if (this.version_ === currentVersion.version) { // version does not change
      return;
    } else if (this.version_ > currentVersion.version) {
      currentVersion.version = this.version_;

      const updateSql: string = new UpdateQuery().fromModel(currentVersion).where(`id = ${currentVersion.id}`).build();

      await this.pgInstance_.query(updateSql);
    }

    // run dependencies
    for (let dependency of this.dependencies_) {
      await dependency.migrate();
    }

    // run operations
    let sqls: Array<string> = [];

    // create necessary functions
    if (setupEnv) {
      let setupEnvSql: string = fs.readFileSync(path.resolve("sql/setup_pg.sql"), "utf8") + "\n";
      sqls.push(setupEnvSql);
    }

    for (let operation of this.operations_) {
      sqls.push(operation.sql());
    }

    await this.pgInstance_.queryInTransaction(sqls);
  }
}
