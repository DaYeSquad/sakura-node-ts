// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.


import * as fs from "fs";
import * as path from "path";

import {
  Operation, AddModelOperation, AddColumnOperation, DropColumnOperation,
  RenameColumnOperation, ChangeColumnTypeOperation, AddCommentOperation
} from "./operation";
import {Field} from "./column";
import {DriverOptions} from "../driveroptions";
import {SqlType} from "../../base/model";
import {InsertQuery} from "../../sqlquery/insertquery";
import {DBClient} from "../dbclient";
import {Version} from "./version";
import {SelectQuery} from "../../sqlquery/selectquery";
import {QueryResult} from "../queryresult";
import {UpdateQuery} from "../../sqlquery/updatequery";
import {version} from "punycode";
import {PgDriver} from "../postgres/pgdriver";

export interface MigrationOptions {
  version: number;
  appName: string;
  driverOptions: DriverOptions;
}

/**
 * Migration tool for PostgreSQL and MySQL.
 *
 * Usage:
 *  let migration = new Migration(3, driverOptions);
 *  migration.addModel(User); // Adds User"s table.
 *  migration.migrate(); // migrate database.
 */
export class Migration {
  protected version_: number = 0;
  protected appName_: string = "";
  protected dbClient_: DBClient;

  protected operations_: Array<Operation> = [];
  protected dependencies_: Array<Migration> = [];

  /**
   * Init with current migration version, be sure to use INTEGER value.
   * @param options Migration options.
   */
  constructor(options: MigrationOptions) {
    this.version_ = options.version;
    this.appName_ = options.appName;
    this.dbClient_ = new DBClient(options.driverOptions);
  }

  /**
   * Adds model"s table.
   * @param cls Class extends model.
   */
  addModel(cls: Function): void {
    this.operations_.push(new AddModelOperation(cls));
    this.operations_.push(new AddCommentOperation(cls));
  }

  /**
   * Adds column to existing table.
   * @param cls Class extends model.
   * @param column New column.
   */
  addColumn(cls: Function, column: Field): void {
    this.operations_.push(new AddColumnOperation(cls, column));
  }

  /**
   * Drops column from existing table.
   * @param cls Class extends model.
   * @param columnName Column name.
   */
  dropColumn(cls: Function, columnName: string): void {
    this.operations_.push(new DropColumnOperation(cls, columnName));
  }

  /**
   * Renames column in existing table.
   * @param cls Class extends model.
   * @param oldName Old name.
   * @param newName New name.
   */
  renameColumn(cls: Function, oldName: string, newName: string): void {
    this.operations_.push(new RenameColumnOperation(cls, oldName, newName));
  }

  /**
   * Reset column type.
   * @param cls Class extends model.
   * @param columnName  column name.
   * @param newType New column type.
   */
  resetColumnType(cls: Function, columnName: string, newType: SqlType): void {
    this.operations_.push(new ChangeColumnTypeOperation(cls, columnName, newType));
  }

  /**
   * Adds dependency in order, dependency is another migration.
   * @param dependency Previous version migration.
   */
  addDependency(dependency: Migration): void {
    this.dependencies_.push(dependency);
  }

  /**
   * Use dependency array as dependencies.
   * @param dependencies All previous migrations.
   */
  setDependencies(dependencies: Migration[]): void {
    this.dependencies_ = dependencies;
  }

  /**
   * Returns current version as number or undefined is table not exists.
   * @private
   */
  private async currentVersion_(): Promise<number | undefined> {
    // create table
    const createTableOperation: AddModelOperation = new AddModelOperation(Version);
    await this.dbClient_.query(createTableOperation);

    const selectQuery: SelectQuery = new SelectQuery().fromClass(Version).where(`app_name = '${this.appName_}'`).select();
    const result: QueryResult = await this.dbClient_.query(selectQuery);
    if (result.rows.length > 0) {
      return result.rows[0]["version"];
    } else {
      return undefined;
    }
  }

  /**
   * Generates SQL to migrate.
   * @returns {string} SQL.
   */
  preview(): string {
    let sql: string = "";

    for (let i = 0; i < this.operations_.length; i++) {
      let operation: Operation = this.operations_[i];
      sql += this.dbClient_.driver.operationToString(operation);

      if (i !== this.operations_.length - 1) {
        sql += "\n";
      }
    }

    return sql;
  }

  /**
   * Saves migration result to file.
   * @param path Full path of file.
   */
  save(path: string): void {
    const sql: string = this.preview();
    fs.writeFile(path, sql);
  }

  /**
   * Executes migrate sql commands, it is highly recommended to use preview() to see sql before use this method.
   */
  async migrate(setupEnv: boolean = false): Promise<void> {
    // check version
    const currentVersion: number | undefined = await this.currentVersion_();
    if (currentVersion === undefined) { // first time to execute query
      // create table
      const createTableOperation: AddModelOperation = new AddModelOperation(Version);
      await this.dbClient_.query(createTableOperation);

      // insert version
      let version: Version = new Version();
      version.version = this.version_;
      version.appName = this.appName_;
      const insertQuery: InsertQuery = new InsertQuery().fromModel(version);
      await this.dbClient_.query(insertQuery);
    } else if (this.version_ === currentVersion) { // version does not change
      return;
    }

    // run dependencies
    for (let dependency of this.dependencies_) {
      await dependency.migrate();
    }

    // run operations
    let sqls: Array<string> = [];

    // create necessary functions
    if (setupEnv && (this.dbClient_.driver instanceof PgDriver)) {
      let setupEnvSql: string = fs.readFileSync(path.resolve("sql/setup_pg.sql"), "utf8") + "\n";
      sqls.push(setupEnvSql);
    }

    for (let operation of this.operations_) {
      sqls.push(this.dbClient_.driver.operationToString(operation));
    }

    await this.dbClient_.queryRawInTransaction(sqls);

    // update table version
    let version: Version = new Version();
    version.version = this.version_;
    version.appName = this.appName_;
    const updateQuery: UpdateQuery = new UpdateQuery().fromModel(version).where(`id = ${version.id}`);
    await this.dbClient_.query(updateQuery);
  }
}
