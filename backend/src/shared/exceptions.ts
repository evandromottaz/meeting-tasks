export class HttpError extends Error {
	constructor(public readonly status: number, message: string) {
		super(message);
		this.name = 'HttpError';
	}
}

export class BadRequestError extends HttpError {
	constructor(message = 'Bad Request') {
		super(400, message);
		this.name = 'BadRequestError';
	}
}

export class UnauthorizedError extends HttpError {
	constructor(message = 'Unauthorized') {
		super(401, message);
		this.name = 'UnauthorizedError';
	}
}

export class ForbiddenError extends HttpError {
	constructor(message = 'Forbidden') {
		super(403, message);
		this.name = 'ForbiddenError';
	}
}

export class NotFoundError extends HttpError {
	constructor(message = 'Not Found') {
		super(404, message);
		this.name = 'NotFoundError';
	}
}

export class ConflictError extends HttpError {
	constructor(message = 'Conflict') {
		super(409, message);
		this.name = 'ConflictError';
	}
}

export class InternalServerError extends HttpError {
	constructor(message = 'Internal Server Error') {
		super(500, message);
		this.name = 'InternalServerError';
	}
}
