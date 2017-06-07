// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

export type DriverType = "postgres" | "mysql";

/**
 * Options of database driver.
 */
export interface DriverOptions {
  type: DriverType;

  /**
   * Username (aka User) of database.
   */
  username: string;

  /**
   * Password of database.
   */
  password: string;

  /**
   * Database name.
   */
  database: string;

  /**
   * Host of database.
   */
  host: string;

  /**
   * Port number, if not given, default database port will be used.
   */
  port?: number;
}
