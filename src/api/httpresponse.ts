// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiError} from './apierror';

/**
 * Represents success response with only 1 page.
 */
export class SuccessResponse {
  data: any;
  code: number;
  constructor(data: any, code: number = 200) {
    this.code = code;
    this.data = data;
  }
}

/**
 * ErrorResponse
 */
export class ErrorResponse {
  message: string;
  code: number;
  constructor(message: string) {
    this.code = 501;
    this.message = message;
  }
}

/**
 * Represents bad request (:400) response.
 */
export class BadRequestResponse {
  errors: Array<ApiError>;
  code: number = 400;
  message: string = 'Bad Request';

  constructor(errors: Array<ApiError>) {
    this.errors = errors;
  }

  toJSON(): any {
    return {
      error: {
        errors: this.errors,
        code: this.code,
        message: this.message
      }
    };
  }
}

/**
 * Represents not found (:404) response.
 */
export class NotFoundResponse {
  code: number = 404;
  message: string = 'Not Found';

  constructor(message: string) {
    this.message = message;
  }

  toJSON(): any {
    return {
      error: {
        code: this.code,
        message: this.message
      }
    };
  }
}

/**
 * Represents register error response.
 */
export class RegisterErrorResponse {
  code: number = 409; // 409 Conflict
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  toJSON(): any {
    return {
      error: {
        code: this.code,
        message: this.message
      }
    };
  }
}

/**
 * Represents auth (login) error response.
 */
export class AuthErrorResponse {
  code: number = 400; // 400 bad request
  message: string = '';

  constructor(message: string, code: number = 400) {
    this.message = message;
    this.code = code;
  }

  static missingAuthToken(): AuthErrorResponse {
    return new AuthErrorResponse('Missing authorization token', 401);
  }

  static authRequired(): AuthErrorResponse {
    return new AuthErrorResponse('Authorization required', 401);
  }

  toJSON(): any {
    return {
      error: {
        code: this.code,
        message: this.message
      }
    };
  }
}
