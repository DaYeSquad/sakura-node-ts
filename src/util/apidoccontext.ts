// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.


import {ApiDocParameters} from "../base/apidoc";
import * as fs from "fs";
import {query} from "winston";

/**
 * API document context
 */
export class ApiDocContext {
  private docs_: ApiDocParameters[] = [];

  addDoc(doc: ApiDocParameters): void {
    this.docs_.push(doc);
  }

  apiBlueprintDocument(): string {
    let content: string = "";

    for (let doc of this.docs_) {
      content += `## ${doc.description} [${doc.uri}]\n\n`;
      content += `### ${doc.description} [${doc.method}]\n\n`;
      content += `${this.queryParametersToString_(doc)}`;
      content += `+ Request (application/json)\n\n`;
      content += `    + Body\n\n`;
      content += `            ${doc.requestBody}\n\n`;
      content += `+ Response 200 (application/json)\n\n`;
      content += `    + Body\n\n`;
      content += `            ${doc.responseBody}\n\n`;

      // debug code
      fs.writeFileSync("/tmp/test.md", content);
    }

    return content;
  }

  /**
   * Return part of description like below
   *
   * + Parameters
        + id: 10 (number, required) - 猪体长列表吐出去的 objectId
        + type: `length` (string, required) - length or weight
   */
  private queryParametersToString_(doc: ApiDocParameters): string {
    let content: string = "";
    content += `+ Parameters\n\n`;

    for (let queryParameter of doc.queryParameters) {
      let isRequiredString: string = queryParameter.type;

      if (queryParameter.type.endsWith("?")) {
        isRequiredString = `(${queryParameter.type.slice(0, -1)}, optional)`;
      } else {
        isRequiredString = `(${queryParameter.type}, required)`;
      }

      content += `    + ${queryParameter.key}: ${queryParameter.example} ${isRequiredString} -${queryParameter.description}\n\n`;
    }

    return content;
  }
}

export const apiDocContext = new ApiDocContext();
