import { Model } from '../base/model';
export declare class UpdateQuery {
    private table_;
    private where_;
    private updates_;
    private model_;
    private setValuesSqlFromModel_;
    table(name: string): this;
    tableNameFromClass(cls: Function): this;
    set(key: string, value: any): this;
    fromModel(model: Model): this;
    where(...args: any[]): this;
    build(): string;
}
