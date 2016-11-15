export declare class Model {
    [key: string]: any;
    static modelFromRow<T extends Model>(row: any, type: {
        new (): T;
    }): T;
    static modelsFromRows<T extends Model>(rows: any[], type: {
        new (): T;
    }): T[];
}
export interface SqlField {
    name?: string;
    type: SqlType;
    flag: SqlFlag;
    columnName?: string;
}
export declare enum SqlType {
    TEXT = 0,
    VARCHAR = 1,
    INT = 2,
    DATE = 3,
    TIMESTAMP = 4,
    JSON = 5,
    NUMERIC = 6,
}
export declare enum SqlFlag {
    PRIMARY_KEY = 0,
    NOT_NULL = 1,
    NULLABLE = 2,
}
