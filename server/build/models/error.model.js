"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.CustomError = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class CustomError extends Error {
    constructor(message, status, name) {
        super(message);
        this.status = status;
        this.name = name !== null && name !== void 0 ? name : "Error";
    }
}
exports.CustomError = CustomError;
class BadRequestError extends CustomError {
    constructor(message) {
        super(message, http_status_codes_1.default.BAD_REQUEST, "Bad Request");
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message, http_status_codes_1.default.UNAUTHORIZED, "Unauthorized");
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends CustomError {
    constructor(message) {
        super(message, http_status_codes_1.default.FORBIDDEN, "Forbidden");
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends CustomError {
    constructor(message) {
        super(message, http_status_codes_1.default.CONFLICT, "Conflict");
    }
}
exports.ConflictError = ConflictError;
class NotFoundError extends CustomError {
    constructor(message) {
        super(message, http_status_codes_1.default.NOT_FOUND, "Not Found");
    }
}
exports.NotFoundError = NotFoundError;
