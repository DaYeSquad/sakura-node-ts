"use strict";
const sqlcontext_1 = require('../util/sqlcontext');
const model_1 = require('../base/model');
class SqlGenerator {
    generateCreateTableSql(cls) {
        const tableName = sqlcontext_1.sqlContext.findTableByClass(cls);
        let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
        const sqlFields = sqlcontext_1.sqlContext.findSqlFields(cls);
        sqlFields.forEach((sqlField, index) => {
            const type = this.sqlTypeToCreateSyntaxString_(sqlField.type);
            const flag = this.sqlFlagToCreateSyntaxString_(sqlField.flag);
            let flagWithWhiteSpace = '';
            if (flag !== '') {
                flagWithWhiteSpace = ` ${flag}`;
            }
            let comment = '';
            if (sqlField.comment) {
                comment = ` --${sqlField.comment}`;
            }
            let comma = index === (sqlFields.length - 1) ? '' : ',';
            let defaultValueWithWhiteSpace = '';
            if (sqlField.defaultValue) {
                if (sqlField.defaultValue.type === model_1.SqlDefaultValueType.SERIAL) {
                    sql += `${sqlField.columnName} SERIAL${comma}${comment}\n`;
                    return;
                }
                defaultValueWithWhiteSpace = ` DEFAULT ${this.sqlDefaultValueToCreateSyntaxString_(sqlField.defaultValue)}`;
            }
            sql += `${sqlField.columnName} ${type}${flagWithWhiteSpace}${defaultValueWithWhiteSpace}${comma}${comment}\n`;
        });
        sql += `);`;
        return sql;
    }
    generateAlertTableWithAddColumnAction(cls, column) {
        const tableName = sqlcontext_1.sqlContext.findTableByClass(cls);
        const type = this.sqlTypeToCreateSyntaxString_(column.type);
        let defaultValueWithWhiteSpace = '';
        if (column.defaultValue) {
            defaultValueWithWhiteSpace = ` DEFAULT ${this.sqlDefaultValueToCreateSyntaxString_(column.defaultValue)}`;
        }
        return `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${type}${defaultValueWithWhiteSpace};`;
    }
    generateAlertTableWithDropColumnAction(cls, columnName) {
        const tableName = sqlcontext_1.sqlContext.findTableByClass(cls);
        return `ALTER TABLE ${tableName} DROP COLUMN IF EXISTS ${columnName};`;
    }
    generateAlertTableWithRenameColumnAction(cls, oldName, newName) {
        const tableName = sqlcontext_1.sqlContext.findTableByClass(cls);
        return `ALTER TABLE ${tableName} RENAME COLUMN ${oldName} TO ${newName};`;
    }
    generateColumnCommentAction(cls) {
        let sql = '';
        const tableName = sqlcontext_1.sqlContext.findTableByClass(cls);
        const sqlFields = sqlcontext_1.sqlContext.findSqlFields(cls);
        for (let sqlField of sqlFields) {
            if (sqlField.comment) {
                sql += `COMMENT ON COLUMN ${tableName}.${sqlField.columnName} IS '${sqlField.comment}';\n`;
            }
        }
        return sql;
    }
    sqlTypeToCreateSyntaxString_(sqlType) {
        switch (sqlType) {
            case model_1.SqlType.INT: return 'INTEGER';
            case model_1.SqlType.VARCHAR_1024: return 'VARCHAR(1024)';
            case model_1.SqlType.VARCHAR_255: return 'VARCHAR(255)';
            case model_1.SqlType.TIMESTAMP: return 'TIMESTAMP';
            case model_1.SqlType.JSON: return 'JSON';
            case model_1.SqlType.NUMERIC: return 'NUMERIC';
            case model_1.SqlType.DATE: return 'DATE';
            case model_1.SqlType.TEXT: return 'TEXT';
            default: throw Error(`Undefined SqlType ${sqlType}`);
        }
    }
    sqlFlagToCreateSyntaxString_(sqlFlag) {
        if (sqlFlag === model_1.SqlFlag.PRIMARY_KEY) {
            return 'PRIMARY KEY';
        }
        return '';
    }
    sqlDefaultValueToCreateSyntaxString_(sqlDefaultValue) {
        if (sqlDefaultValue.type === model_1.SqlDefaultValueType.MAKE_RANDOM_ID) {
            return 'make_random_id()';
        }
        return '';
    }
}
exports.SqlGenerator = SqlGenerator;
exports.sqlGenerator = new SqlGenerator();

//# sourceMappingURL=sqlgenerator.js.map
