import * as pg from "pg";
export declare class PgClient {
    private static instance_;
    private pool_;
    init(user: string, password: string, database: string, host: string, port: number, max: number, idleTimeoutMillis: number): void;
    static getInstance(): PgClient;
    static setInstance(client: PgClient): void;
    query(sql: string): Promise<pg.QueryResult>;
}
