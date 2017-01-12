// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as express from "express";

/**
 * CORS middleware for "Access-Control-Allow".
 *
 * @param headers HTTP headers, deafult is "X-Requested-With", "content-type", "Token".
 * @param methods HTTP method string, can be one of "GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE", default is allow all.
 **/
export function corsAllowAll(headers?: string[], methods?: string[]): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    let allowMethodsStr: string = "GET, POST, OPTIONS, PUT, PATCH, DELETE";
    if (methods) {
      allowMethodsStr = methods.join(",");
    }
    res.setHeader("Access-Control-Allow-Methods", allowMethodsStr);

    // Request headers you wish to allow
    let allowHeaderStr: string = "X-Requested-With,content-type,Token";
    if (headers) {
      allowHeaderStr = headers.join(",");
    }
    res.setHeader("Access-Control-Allow-Headers", allowHeaderStr);

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Pass to next layer of middleware
    next();
  };
}
