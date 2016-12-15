export declare class InitTestDb {
    private operations_;
    initAllTableSql(): void;
    addModel(cls: Function): void;
    preview(): string;
    save(path?: string): void;
}
