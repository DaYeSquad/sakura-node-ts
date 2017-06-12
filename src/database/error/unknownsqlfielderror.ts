// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {SqlField} from "../../base/model";

/**
 * Thrown when model[sqlField.name] cannot be found.
 */
export class UnknownSqlFieldError extends Error {
  name = "UnknownSqlFieldError";

  constructor(sqlField: SqlField) {
    super();
    this.message = `Unknown sqlField ${sqlField.name}, ${sqlField.columnName}`;
  }
}
