// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * Thrown when logic code is down (should be "impossible").
 */
export class InternalError extends Error {
  name = "InternalError";

  constructor(className: string) {
    super();
    this.message = `Internal error happened in ${className}`;
  }
}
