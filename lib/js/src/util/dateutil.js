"use strict";
(function (DateEqualityPrecision) {
    DateEqualityPrecision[DateEqualityPrecision["DAY"] = 0] = "DAY";
    DateEqualityPrecision[DateEqualityPrecision["SECOND"] = 1] = "SECOND";
})(exports.DateEqualityPrecision || (exports.DateEqualityPrecision = {}));
var DateEqualityPrecision = exports.DateEqualityPrecision;
class DateUtil {
    static isDateEqual(d1, d2, option = DateEqualityPrecision.SECOND) {
        if (option === DateEqualityPrecision.DAY) {
            return (d1.getFullYear() === d2.getFullYear()) &&
                (d1.getMonth() === d2.getMonth()) &&
                (d1.getDate() === d2.getDate());
        }
        else {
            return d1.getTime() === d2.getTime();
        }
    }
    static millisecondToTimestamp(ms) {
        return Math.floor(ms / 1000);
    }
    static timestampToMillisecond(ts) {
        return ts * 1000;
    }
}
exports.DateUtil = DateUtil;

//# sourceMappingURL=dateutil.js.map
