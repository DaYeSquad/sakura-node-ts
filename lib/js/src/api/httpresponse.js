"use strict";
class HttpResponse {
    constructor(code) {
        this.code = 0;
        this.code = code;
    }
}
exports.HttpResponse = HttpResponse;
class SuccessResponse extends HttpResponse {
    constructor(data, code = 200) {
        super(code);
        this.data = data;
        this.data.code = code;
    }
}
exports.SuccessResponse = SuccessResponse;
class ErrorResponse {
    constructor(message) {
        this.code = 501;
        this.message = message;
    }
}
exports.ErrorResponse = ErrorResponse;
class BadRequestResponse extends HttpResponse {
    constructor(errors) {
        super(400);
        this.message = 'Bad Request';
        this.errors = errors;
    }
    toJSON() {
        return {
            error: {
                errors: this.errors,
                code: this.code,
                message: this.message
            }
        };
    }
}
exports.BadRequestResponse = BadRequestResponse;
class NotFoundResponse extends HttpResponse {
    constructor(message) {
        super(404);
        this.message = 'Not Found';
        this.message = message;
    }
    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message
            }
        };
    }
}
exports.NotFoundResponse = NotFoundResponse;
class RegisterErrorResponse extends HttpResponse {
    constructor(message) {
        super(409);
        this.message = message;
    }
    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message
            }
        };
    }
}
exports.RegisterErrorResponse = RegisterErrorResponse;
class AuthErrorResponse extends HttpResponse {
    constructor(message, code = 400) {
        super(code);
        this.message = '';
        this.message = message;
        this.code = code;
    }
    static missingAuthToken() {
        return new AuthErrorResponse('Missing authorization token', 401);
    }
    static authRequired() {
        return new AuthErrorResponse('Authorization required', 401);
    }
    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message
            }
        };
    }
}
exports.AuthErrorResponse = AuthErrorResponse;

//# sourceMappingURL=httpresponse.js.map
