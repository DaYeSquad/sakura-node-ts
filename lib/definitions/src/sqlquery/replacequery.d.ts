import { SqlType } from '../base/model';
export declare class ReplaceQuery {
    private table_;
    private where_;
    private newValues_;
    fromClass(cls: Function): this;
    where(...args: any[]): this;
    set(key: string, value: any, sqlType: SqlType): this;
    build(): string;
}
