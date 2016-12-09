export declare enum DateFormtOption {
    YEAR_MONTH_DAY = 0,
}
export declare class DateFormatter {
    static stringFromDate(date: Date, option: DateFormtOption, symbol: string): string;
}
