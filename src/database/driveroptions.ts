// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

export enum DriverType {
  POSTGRES,
  MYSQL
}

/**
 * Options of cluster mode
 */
export interface ClusterOptions {
  master: DriverConnectionOptions;
  slaves: DriverConnectionOptions[];
}

/**
 * Basic connection options for driver
 */
export interface DriverConnectionOptions {
  /**
   * Username (aka User) of database.
   */
  username?: string;

  /**
   * Password of database.
   */
  password?: string;

  /**
   * Database name.
   */
  database?: string;

  /**
   * Host of database.
   */
  host?: string;

  /**
   * Port number, if not given, default database port will be used.
   */
  port?: number;
}

/**
 * Options of database driver.
 */
export interface DriverOptions extends DriverConnectionOptions {
  type: DriverType;

  /**
   * Cluster options, if used, ignores host, port, database in parent level.
   */
  clusterOptions?: ClusterOptions;
}
