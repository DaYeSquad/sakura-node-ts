import { Field } from './column';
export declare abstract class Operation {
    protected modelClass_: Function;
    abstract sql(): string;
}
export declare abstract class ModelOperation extends Operation {
}
export declare abstract class ColumnOperation extends Operation {
}
export declare class AddModelOperation extends ModelOperation {
    constructor(cls: Function);
    sql(): string;
}
export declare class InitCommentOperation extends ModelOperation {
    constructor(cls: Function);
    sql(): string;
}
export declare class AddColumnOperation extends ColumnOperation {
    private column_;
    constructor(cls: Function, column: Field);
    sql(): string;
}
export declare class DropColumnOperation extends ColumnOperation {
    private name_;
    constructor(cls: Function, name: string);
    sql(): string;
}
export declare class RenameColumnOperation extends ColumnOperation {
    private oldName_;
    private newName_;
    constructor(cls: Function, oldName: string, newName: string);
    sql(): string;
}
