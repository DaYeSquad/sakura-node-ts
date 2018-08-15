// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

export interface ApiDocQueryParameters {
  key: string;
  example: any;
  type: "number" | "number?" | "string" | "string?" | "boolean" | "boolean?";
  description: string;
}

/**
 * API Group of api descriptions
 */
export interface ApiDoc {
  groupName: string;
  descriptions: ApiDescription[];
}

/**
 * API description
 */
export interface ApiDescription {
  /**
   * Function that being described
   */
  function: Function;

  /**
   * HTTP Methods
   */
  method: "GET" | "PUT" | "POST" | "DELETE";

  /**
   * URI, eg: /user_info
   */
  uri: string;

  /**
   * query parameters from URI
   */
  queryParameters?: ApiDocQueryParameters[];

  /**
   * description of API
   */
  description: string;

  /**
   * detail description of API
   */
  detailDescription?: string;

  /**
   * request headers
   */
  requestHeaders?: any;

  /**
   * request body
   */
  requestBody?: any;

  /**
   * expect response body
   */
  responseBody?: any;
}
