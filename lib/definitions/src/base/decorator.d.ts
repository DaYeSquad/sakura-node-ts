import { SqlType, SqlFlag, SqlDefaultValue } from './model';
export declare function TableName(name: string): Function;
export declare function Column(name: string, type: SqlType, flag: SqlFlag, comment?: string, defaultValue?: SqlDefaultValue): Function;
