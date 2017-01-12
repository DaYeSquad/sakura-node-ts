// Copyright (c) 2016 (jw872505975@gmail.com). All rights reserved.

import * as fs from "fs";
import {Operation, AddModelOperation} from "./operation";
import {sqlContext} from "../util/sqlcontext";


export class InitTestDb {
  private operations_: Array<Operation> = [];

  initAllTableSql(): void {
    for (let cls of sqlContext.getTables().keys() ) {
      this.operations_.push(new AddModelOperation(cls));
    }
  }
  addModel(cls: Function): void {
    this.operations_.push(new AddModelOperation(cls));
  }

  preview(): string {
    let sql: string = "";

    for (let i = 0; i < this.operations_.length; i++) {
      let operation: Operation = this.operations_[i];
      sql += operation.sql();

      if (i !== this.operations_.length - 1) {
        sql += "\n";
      }
    }
    return sql;
  }

  save (path: string = "sql/test/initTestDb.sql"): void {
    const sql: string = this.preview();
    fs.writeFile(path, sql);

  }

}
