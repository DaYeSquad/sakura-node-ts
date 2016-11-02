// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as express from "express";

/**
 * CORS middleware for allowing restrict request.
 */
export function corsAllowOnce(): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const requestOrigin: string = req.header('Origin');
    if (!requestOrigin) {
      return next();
    } else {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    }

    const customMethod: string = req.header('Access-Control-Allow-Methods');
    const customHeaders: string = req.header('Access-Control-Allow-Headers');

    if (customMethod) {
      res.setHeader('Access-Control-Allow-Methods', customMethod);
    }

    if (customHeaders) {
      res.setHeader('Access-Control-Allow-Headers', customHeaders);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return next();
  };
}

/**
 * Token middleware for parsing token and add 'uid' to express.Request.
 */
export function corsAllowAll(): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
  };
}
