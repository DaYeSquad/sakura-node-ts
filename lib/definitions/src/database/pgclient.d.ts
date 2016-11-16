import * as pg from "pg";
import { PgClientConfig } from "./pgclientconfig";
import { PgQueryResult } from "../base/typedefines";
export declare class PgClient {
    private static instance_;
    private pool_;
    init(user: string, password: string, database: string, host: string, port: number, max: number, idleTimeoutMillis: number): void;
    initWithPgClientConfig(config: PgClientConfig): void;
    static getInstance(): PgClient;
    static setInstance(client: PgClient): void;
    query(sql: string): Promise<pg.QueryResult>;
    queryInTransaction(sqls: string[]): Promise<PgQueryResult>;
}
