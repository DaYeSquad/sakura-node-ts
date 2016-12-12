import { Column } from './column';
export declare class Migration {
    private operations_;
    private dependencies_;
    addModel(cls: Function): void;
    addColumn(cls: Function, column: Column): void;
    dropColumn(cls: Function, columnName: string): void;
    renameColumn(cls: Function, oldName: string, newName: string): void;
    addDependency(dependency: Migration): void;
    setDependencies(dependencies: Migration[]): void;
    preview(): string;
    migrate(): void;
}
