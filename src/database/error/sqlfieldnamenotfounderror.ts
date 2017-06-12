// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * Thrown when model[sqlField.name] cannot be found.
 */
export class SqlFieldNameNotFound extends Error {
  name = "SqlFieldNameNotFound";

  constructor(name: string) {
    super();
    this.message = `value model[${name}] not found`;
  }
}
