import { Field } from './column';
import { PgClient } from '../database/pgclient';
export declare class Migration {
    private version_;
    private pgInstance_;
    private operations_;
    private dependencies_;
    constructor(version: number, pgClient: PgClient);
    addModel(cls: Function): void;
    addColumn(cls: Function, column: Field): void;
    dropColumn(cls: Function, columnName: string): void;
    renameColumn(cls: Function, oldName: string, newName: string): void;
    addDependency(dependency: Migration): void;
    setDependencies(dependencies: Migration[]): void;
    private currentVersion_();
    preview(): string;
    save(path: string): void;
    migrate(setupEnv?: boolean): Promise<void>;
}
