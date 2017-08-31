// Copyright 2017 loli (ipv4sec@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as express from "express";

/**
 * Set X-Powered-By middle ware .
 */
export function setPowerBy(copyright?: string): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (copyright) {
      res.setHeader("X-Powered-By", copyright);
    }else {
      res.removeHeader("X-Powered-By");
    }
    next();
  };
}
