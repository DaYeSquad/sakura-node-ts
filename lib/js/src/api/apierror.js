"use strict";
class ApiError {
    constructor(reason, message) {
        this.domain = "ErrorDomain";
        this.reason = reason;
        this.message = message;
    }
}
exports.ApiError = ApiError;

//# sourceMappingURL=apierror.js.map
