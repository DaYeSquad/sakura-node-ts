// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {DriverType} from "../driveroptions";

/**
 * Thrown when user tries to pass un-support database.
 */
export class UnknownDriverError extends Error {
  name = "UnknownDriverError";

  constructor(unknownDriverType: DriverType) {
    super();
    this.message = `Unknown driver type ${unknownDriverType}`;
  }
}
