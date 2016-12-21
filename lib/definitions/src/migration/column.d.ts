import { SqlType, SqlFlag, SqlDefaultValue } from '../base/model';
export interface Field {
    name: string;
    type: SqlType;
    flag: SqlFlag;
    comment?: string;
    defaultValue?: SqlDefaultValue;
}
