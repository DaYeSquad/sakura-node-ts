// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {SqlType, SqlFlag, SqlDefaultValue} from "../base/model";

/**
 * Column description.
 */
export interface Field {
  name: string;
  type: SqlType;
  flag: SqlFlag;
  comment?: string;
  defaultValue?: SqlDefaultValue;
}
