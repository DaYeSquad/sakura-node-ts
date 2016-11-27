import { Model } from "../base/model";
export declare class SelectQuery {
    private table_;
    private where_;
    private selectFields_;
    private orderBys_;
    private limit_;
    private pkwhere_;
    from(table: string): this;
    fromClass(cls: Function): this;
    fromTable(table: string): this;
    select(fields?: string[]): this;
    where(...args: any[]): this;
    pkwhere(model: Model): this;
    orderBy(sort: string, order?: 'ASC' | 'DESC'): this;
    setLimit(limit: number): this;
    build(): string;
}
