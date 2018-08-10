// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.


import {ApiDocParameters} from "../base/apidoc";
import * as fs from "fs";

/**
 * API document context
 */
export class ApiDocContext {
  private docs_: ApiDocParameters[] = [];

  addDoc(doc: ApiDocParameters): void {
    this.docs_.push(doc);
  }

  removeAllDocs(): void {
    this.docs_ = [];
  }

  generateBlueprintDocument(): string {
    let content: string = "";

    for (let doc of this.docs_) {
      content += `## ${doc.description} [${doc.uri}]\n\n`;
      content += `### ${doc.detailDescription ? doc.detailDescription : doc.description} [${doc.method}]\n\n`;

      if (doc.queryParameters) {
        content += `${this.queryParametersToString_(doc)}`;
      }

      if (doc.requestBody) {
        content += `${this.requestBodyToString_(doc.requestBody)}`;
        content += `\n\n`;
      }

      if (doc.responseBody) {
        content += `${this.responseBodyToString_(doc.responseBody)}`;
      }
    }

    // debug code
    fs.writeFileSync("/tmp/test.md", content);

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

      content += `    + ${queryParameter.key}: ${queryParameter.example} ${isRequiredString} - ${queryParameter.description}\n\n`;
    }

    return content;
  }

  private requestBodyToString_(requestBody: any): string {
    let content: string = "";
    content += `+ Request (application/json)\n\n`;
    content += `    + Body\n\n`;
    content += `            ${JSON.stringify(requestBody, null, 4)}\n\n`.replace(/\n\r?/g, "\n            ");
    content = content.slice(0, -26); // remove unused line
    return content;
  }

  private responseBodyToString_(responseBody: any): string {
    let content: string = "";
    content += `+ Response 200 (application/json)\n\n`;
    content += `    + Body\n\n`;
    content += `            ${JSON.stringify(responseBody, null, 4)}\n\n`.replace(/\n\r?/g, "\n            ");
    content = content.slice(0, -26); // remove unused line
    return content;
  }
}

export const apiDocContext = new ApiDocContext();
