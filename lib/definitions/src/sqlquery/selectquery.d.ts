export declare class SelectQuery {
    private table_;
    private where_;
    private selectFields_;
    private orderBys_;
    private limit_;
    private joinUsings_;
    from(table: string): this;
    fromClass(cls: Function): this;
    fromTable(table: string): this;
    joinUsing(joninStr: string): this;
    select(fields?: string[]): this;
    where(...args: any[]): this;
    orderBy(sort: string, order?: 'ASC' | 'DESC'): this;
    setLimit(limit: number): this;
    build(): string;
}
