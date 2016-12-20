"use strict";
var DateFormtOption;
(function (DateFormtOption) {
    DateFormtOption[DateFormtOption["YEAR_MONTH_DAY"] = 0] = "YEAR_MONTH_DAY";
})(DateFormtOption = exports.DateFormtOption || (exports.DateFormtOption = {}));
class DateFormatter {
    static stringFromDate(date, option, symbol) {
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let year = date.getFullYear();
        if (option === DateFormtOption.YEAR_MONTH_DAY) {
            return `${year}${symbol}${mm}${symbol}${dd}`;
        }
        return '';
    }
}
exports.DateFormatter = DateFormatter;

//# sourceMappingURL=dateformatter.js.map
