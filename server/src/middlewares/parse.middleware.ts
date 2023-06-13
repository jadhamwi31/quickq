import { NextFunction, Request, Response } from "express";

export const parseRemainingFields = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	req.body = Object.fromEntries(
		Object.entries(req.body).map(([key, value]) => {
			try {
				const parsedObject = JSON.parse(value as string);
				return [key, parsedObject];
			} catch (e) {
				return [key, value];
			}
		})
	);
	next();
};
