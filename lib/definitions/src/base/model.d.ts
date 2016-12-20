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
    defaultValue?: SqlDefaultValue;
    comment?: string;
}
export declare enum SqlType {
    TEXT = 0,
    VARCHAR_255 = 1,
    VARCHAR_1024 = 2,
    INT = 3,
    DATE = 4,
    TIMESTAMP = 5,
    JSON = 6,
    NUMERIC = 7,
    BOOLEAN = 8,
}
export declare enum SqlFlag {
    PRIMARY_KEY = 0,
    NOT_NULL = 1,
    NULLABLE = 2,
}
export declare enum SqlDefaultValueType {
    MAKE_RANDOM_ID = 0,
    NUMBER = 1,
    SERIAL = 2,
}
export declare class SqlDefaultValue {
    type: SqlDefaultValueType;
    private value_;
    static MAKE_RANDOM_ID(): SqlDefaultValue;
    static SERIAL(): SqlDefaultValue;
    static NUMBER(num: number): SqlDefaultValue;
}
