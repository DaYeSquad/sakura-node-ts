// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

export enum DateEqualityPrecision {
  DAY,
  SECOND
}

/**
 * Includes some useful methods.
 */
export class DateUtil {

  /**
   * Returns true if two Date object is equal.
   * @param d1 Date 1.
   * @param d2 Date 2.
   * @param option Precision of equality.
   * @returns {boolean} True if two Date object is equal.
   */
  static isDateEqual(d1: Date, d2: Date, option: DateEqualityPrecision = DateEqualityPrecision.SECOND): boolean {
    if (option === DateEqualityPrecision.DAY) {
      return (d1.getFullYear() === d2.getFullYear()) &&
        (d1.getMonth() === d2.getMonth()) &&
        (d1.getDate() === d2.getDate());
    } else { // SECOND
      return d1.getTime() === d2.getTime();
    }
  }

  /**
   * Casts millisecond to timestamp.
   * @param ms Millisecond
   * @returns {number} Timestamp.
   */
  static millisecondToTimestamp(ms: number): timestamp {
    return Math.floor(ms / 1000);
  }

  /**
   * Casts timestamp to millisecond.
   * @param ts Timestamp.
   * @returns {number} Millisecond.
   */
  static timestampToMillisecond(ts: timestamp): number {
    return ts * 1000;
  }
}