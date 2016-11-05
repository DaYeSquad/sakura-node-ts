import { timestamp } from "../base/typedefines";
export declare enum DateEqualityPrecision {
    DAY = 0,
    SECOND = 1,
}
export declare class DateUtil {
    static isDateEqual(d1: Date, d2: Date, option?: DateEqualityPrecision): boolean;
    static millisecondToTimestamp(ms: number): timestamp;
    static timestampToMillisecond(ts: timestamp): number;
}
