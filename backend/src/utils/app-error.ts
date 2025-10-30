import { HTTP_STATUS_CODE, HttpStatusCodeType } from "../config/http.config";

export const ErrorCodes = {
    ERR_INTERNAL: "ERR_INTERNAL",
    ERR_NOT_FOUND: "ERR_NOT_FOUND",
    ERR_CONFLICT: "ERR_CONFLICT",
    ERR_BAD_REQUEST: "ERR_BAD_REQUEST",
    ERR_UNAUTHORIZED: "ERR_UNAUTHORIZED",
    ERR_FORBIDDEN: "ERR_FORBIDDEN",
} as const;


export class AppError extends Error {
    constructor(message: string, public statusCode: HttpStatusCodeType = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, public errorCode: string = ErrorCodes.ERR_INTERNAL) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}   

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS_CODE.NOT_FOUND, ErrorCodes.ERR_NOT_FOUND);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, ErrorCodes.ERR_INTERNAL);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS_CODE.CONFLICT, ErrorCodes.ERR_CONFLICT);
    }
}


export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS_CODE.BAD_REQUEST, ErrorCodes.ERR_BAD_REQUEST);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS_CODE.UNAUTHORIZED, ErrorCodes.ERR_UNAUTHORIZED);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS_CODE.FORBIDDEN, ErrorCodes.ERR_FORBIDDEN);
    }
}