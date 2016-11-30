import { ApiError } from './apierror';
export declare class SuccessResponse {
    data: any;
    constructor(data: any);
}
export declare class BadRequestResponse {
    errors: Array<ApiError>;
    code: number;
    message: string;
    constructor(errors: Array<ApiError>);
    toJSON(): any;
}
export declare class NotFoundResponse {
    code: number;
    message: string;
    constructor(message: string);
    toJSON(): any;
}
export declare class RegisterErrorResponse {
    code: number;
    message: string;
    constructor(message: string);
    toJSON(): any;
}
export declare class AuthErrorResponse {
    code: number;
    message: string;
    constructor(message: string, code?: number);
    static missingAuthToken(): AuthErrorResponse;
    static authRequired(): AuthErrorResponse;
    toJSON(): any;
}
