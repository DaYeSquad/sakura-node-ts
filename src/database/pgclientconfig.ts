// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as fs from 'fs';

/**
 * Parser of *.pg.dbconfig.json.
 */
export class PgClientConfig {
  user: string;
  password: string;
  datebase: string;
  host: string;
  port: number;

  constructor(filePath: string) {
    const configJson: any = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    this.user = configJson['user'];
    this.password = configJson['password'];
    this.datebase = configJson['database'];
    this.host = configJson['host'];
    this.port = configJson['port'];
  }
}
