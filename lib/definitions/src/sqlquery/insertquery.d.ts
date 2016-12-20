import { Model } from '../base/model';
export declare class InsertQuery {
    private model_;
    private returnId_;
    fromModel(model: Model): this;
    returnId(b: boolean): this;
    build(): string;
}
