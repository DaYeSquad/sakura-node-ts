import { Model } from '../../base/model';
export declare enum TransactionAction {
    BUY = 0,
    SELL = 1,
}
export declare class Transaction extends Model {
    private id_;
    uid: number;
    stockId: string;
    actionType: number;
    position: number;
    positionSizing: number;
    brokerId: string;
    actionTimestamp: number;
    init(uid: number, stockId: string, actionType: number, position: number, positionSizing: number, brokerId: string, actionTimestamp: number): void;
}
