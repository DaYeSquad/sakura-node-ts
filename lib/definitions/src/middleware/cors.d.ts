/// <reference types="express" />
import * as express from 'express';
export declare function corsAllowAll(headers?: string[], methods?: string[]): (req: express.Request, res: express.Response, next: express.NextFunction) => void;
