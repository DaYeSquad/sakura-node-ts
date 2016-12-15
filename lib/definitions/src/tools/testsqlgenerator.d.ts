import { Column } from '../migration/column';
export declare class TestSqlGenerator {
    generateCreateTableSql(cls: Function): string;
    generateAlertTableWithAddColumnAction(cls: Function, column: Column): string;
    generateAlertTableWithDropColumnAction(cls: Function, columnName: string): string;
    generateAlertTableWithRenameColumnAction(cls: Function, oldName: string, newName: string): string;
    generateColumnCommentAction(cls: Function): string;
    private sqlTypeToCreateSyntaxString_(sqlType);
    private sqlFlagToCreateSyntaxString_(sqlFlag);
    private sqlDefaultValueToCreateSyntaxString_(sqlDefaultValue);
}
export declare let testSqlGenerator: TestSqlGenerator;
