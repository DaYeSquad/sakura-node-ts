import { Model, SqlType } from '../base/model';
export interface ModelSqlInfo {
    primaryKey: string;
    keys: Array<string>;
    values: Array<string>;
}
export declare class SqlQuery {
    static getSqlInfoFromDefinition(model: Model): ModelSqlInfo;
    static valueAsStringByType(value: any, sqlType: SqlType): string;
}
