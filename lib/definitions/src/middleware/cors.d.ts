/// <reference types="express" />
import * as express from "express";
export declare function corsAllowOnce(): (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare function corsAllowAll(): (req: express.Request, res: express.Response, next: express.NextFunction) => void;
