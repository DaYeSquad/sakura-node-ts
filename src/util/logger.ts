// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * Internal logger
 */

export function logInfo(message: string): void {
  console.log(`sakura-node-3: ${message}`);
}

export function logError(error: any): void {
  console.log(`sakura-node-3 error: ${error}`);
}
