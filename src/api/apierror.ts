// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * Describes API error.
 */
export class ApiError {
  domain: string = 'ErrorDomain';
  reason: string;
  message: string;

  constructor(reason: string, message: string) {
    this.reason = reason;
    this.message = message;
  }
}
