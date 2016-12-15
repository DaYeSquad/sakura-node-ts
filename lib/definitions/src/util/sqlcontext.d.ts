import { SqlField } from '../base/model';
export declare class SqlContext {
    private tables_;
    private sqlDefinitions_;
    addSqlTableRelation(relation: SqlTableRelation): void;
    findTableByClass(cls: Function): string;
    addSqlField(cls: Function, sqlField: SqlField): void;
    getTables(): Map<Function, string>;
    findSqlFields(cls: Function): SqlField[];
}
export interface SqlTableRelation {
    target: Function;
    name: string;
}
export declare let sqlContext: SqlContext;
