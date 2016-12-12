import { SqlType, SqlFlag, SqlDefaultValue } from '../base/model';
export interface Column {
    name: string;
    type: SqlType;
    flag: SqlFlag;
    comment?: string;
    defaultValue?: SqlDefaultValue;
}
