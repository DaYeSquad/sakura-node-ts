// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.


import * as fs from 'fs';
import * as path from 'path';

import {
  Operation, AddModelOperation, AddColumnOperation, DropColumnOperation,
  RenameColumnOperation, InitCommentOperation
} from './operation';
import {Field} from './column';
import {PgClient} from '../database/pgclient';
import {SelectQuery} from '../sqlquery/selectquery';
import {Version} from './version';
import {PgQueryResult} from '../base/typedefines';
import {InsertQuery} from '../sqlquery/insertquery';
import {sqlGenerator} from '../tools/sqlgenerator';

/**
 * Migration tool for PostgreSQL.
 *
 * Usage:
 *  let migration = new Migration();
 *  migration.addModel(User); // Adds User's table.
 *  migration.migrate(); // migrate database.
 */
export class Migration {
  private version_: number = 0;
  private pgInstance_: PgClient = undefined;

  private operations_: Array<Operation> = [];
  private dependencies_: Array<Migration> = [];

  /**
   * Init with current migration version, be sure to use INTEGER value.
   * @param version Current version.
   */
  constructor(version: number) {
    this.version_ = version;
  }

  /**
   * Adds model's table.
   * @param cls Class extends model.
   */
  addModel(cls: Function): void {
    this.operations_.push(new AddModelOperation(cls));
    this.operations_.push(new InitCommentOperation(cls));
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
    const sql: string = new SelectQuery().fromClass(Version).select().build();
    const result: PgQueryResult = await this.pgInstance_.query(sql);
    if (result.rows.length > 0) {
      return result.rows[0]['version'];
    } else {
      return undefined;
    }
  }

  /**
   * Generates SQL to migrate.
   * @returns {string} SQL.
   */
  preview(): string {
    let sql: string = '';

    for (let i = 0; i < this.operations_.length; i++) {
      let operation: Operation = this.operations_[i];
      sql += operation.sql();

      if (i !== this.operations_.length - 1) {
        sql += '\n';
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
    // init PG
    if (PgClient.getInstance()) {
      this.pgInstance_ = PgClient.getInstance();
    } else {
      throw new Error('UNDEFINED_PG_CLIENT_SHARED_INSTANCE');
    }

    // check version
    const currentVersion: number | undefined = await this.currentVersion_();
    if (currentVersion === undefined) { // first time to execute query
      const createTableSql: string = sqlGenerator.generateCreateTableSql(Version);

      let version: Version = new Version();
      version.version = this.version_;
      const insertSql: string = new InsertQuery().fromModel(version).build();

      await this.pgInstance_.queryInTransaction([createTableSql, insertSql]);
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
    if (setupEnv) {
      let setupEnvSql: string = fs.readFileSync(path.resolve('sql/setup_pg.sql'), 'utf8') + '\n';
      sqls.push(setupEnvSql);
    }

    for (let operation of this.operations_) {
      sqls.push(operation.sql());
    }

    await this.pgInstance_.queryInTransaction(sqls);
  }
}
