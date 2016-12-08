// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

export enum DateFormtOption {
  YEAR_MONTH_DAY
}

/**
 * DateFormatter helps cast from string to date or date to string.
 */
export class DateFormatter {

  /**
   * Format date to string.
   * @param date Date.
   * @param option Option of {DateFormatOption}.
   * @param symbol Cat symbol.
   * @returns {string} Formatted string.
   */
  static stringFromDate(date: Date, option: DateFormtOption, symbol: string): string {
    let dd: number = date.getDate();
    let mm: number = date.getMonth() + 1;
    let year: number = date.getFullYear();

    if (option === DateFormtOption.YEAR_MONTH_DAY) {
      return `${year}${symbol}${mm}${symbol}${dd}`;
    }


    return "";
  }
}