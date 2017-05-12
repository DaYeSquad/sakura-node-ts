// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiError} from "./apierror";
import {isBoolean} from "util";
import * as moment from "moment";


/**
 * Utility to validate input parameters and used by Controller.
 */
export class Validator {
  errors: Array<ApiError> = [];

  /**
   * Returns true if encounter errors through routine.
   * @returns {boolean} true if encounter errors through routine.
   */
  hasErrors(): boolean {
    return (this.errors.length > 0);
  }

  /**
   * Casts any type to number and record error if result is not a number.
   * @param param Any type of input value.
   * @param reason Error reason.
   * @returns {number} Result, should be number type if success.
   */
  toNumber(param: any, reason: string = "param invalid"): number {
    let result: any = Number(param);
    if (isNaN(result)) {
      this.errors.push(new ApiError(reason, "Bad Request"));
    }
    return result;
  }

  /**
   * turn array string into number array
   * @param {*} param number array as string format like: "[1,2,3]"
   * @param {string} [reason="param invalid"]
   * @returns {number}
   *
   * @memberOf Validator
   */
  toNumberArray(param: string, reason: string = "param invalid"): number[] {
    if (param && param.indexOf("[") === 0 && param.lastIndexOf("]") === param.length - 1) {
      let strArr: string [] = param.substring(1, param.length - 1).split(",");
      let numArr: number [] = [];
      for (let str of strArr) {
        let num: number = Number(str);
        if (str !== "" && !isNaN(num)) {
          numArr.push(num);
        } else {
          this.errors.push(new ApiError(reason, "Bad Request"));
          break;
        }
      }
      return numArr;
    } else {
      this.errors.push(new ApiError(reason, "Bad Request"));
    }
  }

  /**
   * Casts any type to string.
   * @param param Any type of input value.
   * @param reason Error reason.
   * @returns {String} Result, should be string type if success.
   */
  toStr(param: any, reason: string = "param invalid"): string {
    if (param === undefined) {
      this.errors.push(new ApiError(reason, "Bad Request"));
    }
    return String(param);
  }

  /**
   * Casts any type to date.
   * @param param Any type of input value.
   * @param reason Error reason.
   * @returns {String} Result, should be date type if success.
   */
  toDate(param: any, reason: string = "param invalid"): Date {
    let dateStr: string = param.toString();
    let date: any = new Date(dateStr);

    if (!date || date.toString() === "Invalid Date") {
      this.errors.push(new ApiError(reason, "Bad Request"));
      return;
    }
    let strArr: string [] = param.substring(0, dateStr.length).split("-");
      for (let str of strArr) {
        if (isNaN(Number(str)) || Number(str) === 0) {
          this.errors.push(new ApiError(reason, "Bad Request"));
          return;
        }
      }
      let yearString: string = "";
      let monthString: string = "";
      let dateString: string = "";
      if (strArr.length === 1) {
        yearString = strArr[0];
        monthString = "01";
        dateString = "01";
      }else if (strArr.length === 2) {
        yearString = strArr[0];
        monthString = (Number(strArr[1]) > 9) ? strArr[1] : `0${Number(strArr[1])}`;
        dateString = "01";
      }else if (strArr.length === 3) {
        yearString = strArr[0];
        monthString = (Number(strArr[1]) > 9) ? strArr[1] : `0${Number(strArr[1])}`;
        dateString = (Number(strArr[2]) > 9) ? strArr[2] : `0${Number(strArr[2])}`;
      }

    let dataFormatString: string = `${yearString}-${monthString}-${dateString}T00:00:00+00`;
    let mo = moment(dataFormatString);
    let timestamp: number = Number(mo.format("X"));
    return new Date(timestamp * 1000);
  }

  /**
   * Casts any type to unix timestamp.
   * @param param Any type of input value.
   * @param reason Error reason.
   * @returns {String} Result, should be number(int) if success.
   */
  toUnixTimestamp(param: any, reason: string = "param invalid"): number {
    let result: any = new Date(param);
    if (!result || isNaN(result)) {
      this.errors.push(new ApiError(reason, "Bad Request"));
    }
    result = Math.floor(result.getTime() / 1000);
    return result;
  }

  /**
   * Casts any type to boolean.
   */
  toBoolean(param: any, reason: string = "param invalid"): boolean {
    if (isBoolean(param)) {
      return Boolean(param);
    } else {
      this.errors.push(new ApiError(reason, "Bad Request"));
      return param;
    }
  }

  /**
   * Asserts condition is true, otherwise it will records the error.
   * @param cond Condition.
   * @param reason Error reason.
   */
  assert(cond: boolean, reason: string): void {
    if (!cond) {
      this.errors.push(new ApiError(reason, "Bad Request"));
    }
  }
}
