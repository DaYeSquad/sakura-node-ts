import { Model } from '../../base/model';
export declare class Stock extends Model {
    stockId: string;
    uid: number;
    dilutedCost: number;
    carryingCost: number;
    sizing: number;
    expectOut: number;
    expectIn: number;
    init(uid: number, stockId: string, dilutedCost: number, carryingCost: number, sizing: number, expectOut?: number, expectIn?: number): void;
}
