// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {DriverOptions, DriverType} from "../database/driveroptions";
/**
 * Test context
 */
export class TestContext {

  static mySqlDriverOptions(): DriverOptions {
    return {
      type: DriverType.MYSQL,
      username: "root",
      password: "111111",
      database: "gagotest",
      host: "localhost",
      port: 3307
    };
  }
}
