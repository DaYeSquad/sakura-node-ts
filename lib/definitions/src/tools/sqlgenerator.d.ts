export declare class SqlGenerator {
    generateCreateTableSql(cls: Function): string;
    private sqlTypeToCreateSyntaxString_(sqlType);
    private sqlFlagToCreateSyntaxString_(sqlFlag);
    private sqlDefaultValueToCreateSyntaxString_(sqlDefaultValue);
}
export declare let sqlGenerator: SqlGenerator;
