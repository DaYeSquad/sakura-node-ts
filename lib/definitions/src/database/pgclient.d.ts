import * as pg from "pg";
import { PgClientConfig } from "./pgclientconfig";
export declare class PgClient {
    private static instance_;
    private pool_;
    init(user: string, password: string, database: string, host: string, port: number, max: number, idleTimeoutMillis: number): void;
    initWithPgClientConfig(config: PgClientConfig): void;
    static getInstance(): PgClient;
    static setInstance(client: PgClient): void;
    query(sql: string): Promise<pg.QueryResult>;
}
