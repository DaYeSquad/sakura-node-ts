// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiError} from './apierror';

/**
 * Represents HTTP response.
 */
export class HttpResponse {
  code: number = 0;

  constructor(code: number) {
    this.code = code;
  }
}

/**
 * Represents success response with only 1 page.
 */
export class SuccessResponse extends HttpResponse {
  data: any;

  constructor(data: any, code: number = 200) {
    super(code);
    this.data = data;
    this.data.code = code;
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
export class BadRequestResponse extends HttpResponse {
  errors: Array<ApiError>;
  message: string = 'Bad Request';

  constructor(errors: Array<ApiError>) {
    super(400);
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
export class NotFoundResponse extends HttpResponse {
  message: string = 'Not Found';

  constructor(message: string) {
    super(404);
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
export class RegisterErrorResponse extends HttpResponse {
  message: string;

  constructor(message: string) {
    super(409); // 409 Conflict
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
export class AuthErrorResponse extends HttpResponse {
  message: string = '';

  constructor(message: string, code: number = 400) {
    super(code);
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
