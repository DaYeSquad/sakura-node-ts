import { ApiError } from './apierror';
export declare class HttpResponse {
    code: number;
    constructor(code: number);
}
export declare class SuccessResponse extends HttpResponse {
    data: any;
    constructor(data: any, code?: number);
    toJSON(): any;
}
export declare class ErrorResponse extends HttpResponse {
    message: string;
    constructor(message: string, code?: number);
    toJSON(): any;
}
export declare class BadRequestResponse extends HttpResponse {
    errors: Array<ApiError>;
    message: string;
    constructor(errors: Array<ApiError>);
    toJSON(): any;
}
export declare class NotFoundResponse extends HttpResponse {
    message: string;
    constructor(message: string);
    toJSON(): any;
}
export declare class RegisterErrorResponse extends HttpResponse {
    message: string;
    constructor(message: string);
    toJSON(): any;
}
export declare class AuthErrorResponse extends HttpResponse {
    message: string;
    constructor(message: string, code?: number);
    static missingAuthToken(): AuthErrorResponse;
    static authRequired(): AuthErrorResponse;
    toJSON(): any;
}
