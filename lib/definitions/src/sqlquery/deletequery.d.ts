export declare class DeleteQuery {
    private table_;
    private where_;
    from(table: string): this;
    fromClass(cls: Function): this;
    where(...args: any[]): this;
    build(): string;
}
