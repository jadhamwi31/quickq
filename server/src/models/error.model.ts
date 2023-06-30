import STATUS_CODE from "http-status-codes";

export class CustomError extends Error {
	status: number;
	constructor(message: string, status: number, name?: string) {
		super(message);
		this.status = status;
		this.name = name ?? "Error";
	}
}

export class BadRequestError extends CustomError {
	constructor(message: string) {
		super(message, STATUS_CODE.BAD_REQUEST, "Bad Request");
	}
}

export class UnauthorizedError extends CustomError {
	constructor(message: string) {
		super(message, STATUS_CODE.UNAUTHORIZED, "Unauthorized");
	}
}

export class ForbiddenError extends CustomError {
	constructor(message: string) {
		super(message, STATUS_CODE.FORBIDDEN, "Forbidden");
	}
}

export class ConflictError extends CustomError {
	constructor(message: string) {
		super(message, STATUS_CODE.CONFLICT, "Conflict");
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string) {
		super(message, STATUS_CODE.NOT_FOUND, "Not Found");
	}
}

export class InternalServerError extends CustomError {
	constructor(message: string) {
		super(message, STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal Server Error");
	}
}
