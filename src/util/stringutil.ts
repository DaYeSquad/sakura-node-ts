// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * String Utils
 */
export class StringUtil {

  /**
   * Remove \n in string, useful when unit testing
   */
  static removeBreaklines(str: string): string {
    return str.replace(/(^[ \t]*\n)/gm, "");
  }
  static repalceSpaceWithDash(str: string): string {
    return str.trim().replace(new RegExp("[ \f\n\r\t\v]+", "g"), "-");
  }
}
