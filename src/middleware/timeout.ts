// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as express from 'express';

/**
 * Timeout middle ware used by 'connect-timeout'.
 */
export function haltOnTimedout(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.timedout) next();
}
