import { NextFunction, Request, Response } from "express";
import { imagesDirectory, upload } from "../services/upload.service";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { InternalServerError } from "../models/error.model";

export const uploadMiddlewares = (imageKey: string) => [
	upload.single(imageKey),
	(req: Request, res: Response, next: NextFunction) => {
		if (req.file) {
			const id = uuid();
			try {
				fs.renameSync(
					req.file.path,
					path.resolve(imagesDirectory, `${id}.png`)
				);
				req.body = { ...req.body, image: `${id}.png` };
			} catch (e) {
				throw new InternalServerError("server error");
			}
		}
		return next();
	},
];
