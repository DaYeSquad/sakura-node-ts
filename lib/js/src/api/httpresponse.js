"use strict";
class SuccessResponse {
    constructor(data) {
        this.data = data;
    }
}
exports.SuccessResponse = SuccessResponse;
class BadRequestResponse {
    constructor(errors) {
        this.code = 400;
        this.message = "Bad Request";
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
class NotFoundResponse {
    constructor(message) {
        this.code = 404;
        this.message = "Not Found";
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
class RegisterErrorResponse {
    constructor(message) {
        this.code = 409;
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
class AuthErrorResponse {
    constructor(message, code = 400) {
        this.code = 400;
        this.message = "";
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
