"use strict";
const apierror_1 = require("./apierror");
class Validator {
    constructor() {
        this.errors = [];
    }
    hasErrors() {
        return (this.errors.length > 0);
    }
    toNumber(param, reason = 'param invalid') {
        let result = Number(param);
        if (isNaN(result)) {
            this.errors.push(new apierror_1.ApiError(reason, 'Bad Request'));
        }
        return result;
    }
    toNumberArray(param, reason = 'param invalid') {
        if (param && param.indexOf('[') === 0 && param.lastIndexOf(']') === param.length - 1) {
            let strArr = param.substring(1, param.length - 1).split(',');
            let numArr = [];
            for (let str of strArr) {
                let num = Number(str);
                if (str !== '' && !isNaN(num)) {
                    numArr.push(num);
                }
                else {
                    this.errors.push(new apierror_1.ApiError(reason, 'Bad Request'));
                    break;
                }
            }
            return numArr;
        }
        else {
            this.errors.push(new apierror_1.ApiError(reason, 'Bad Request'));
        }
    }
    toStr(param, reason = 'param invalid') {
        if (param === undefined) {
            this.errors.push(new apierror_1.ApiError(reason, 'Bad Request'));
        }
        return String(param);
    }
    toDate(param, reason = 'param invalid') {
        let result = new Date(param);
        if (!result) {
            this.errors.push(new apierror_1.ApiError(reason, 'Bad Request'));
        }
        return result;
    }
    toUnixTimestamp(param, reason = 'param invalid') {
        let result = new Date(param);
        if (!result || isNaN(result)) {
            this.errors.push(new apierror_1.ApiError(reason, 'Bad Request'));
        }
        result = Math.floor(result.getTime() / 1000);
        return result;
    }
    toBoolean(param, reason = 'param invalid') {
        if (param === typeof Boolean) {
            return Boolean(param);
        }
        else {
            this.errors.push(new apierror_1.ApiError(reason, 'Bad Request'));
            return param;
        }
    }
    assert(cond, reason) {
        if (!cond) {
            this.errors.push(new apierror_1.ApiError(reason, 'Bad Request'));
        }
    }
}
exports.Validator = Validator;

//# sourceMappingURL=validator.js.map
