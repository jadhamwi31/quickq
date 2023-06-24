import { NextFunction, Request, Response, json, urlencoded } from "express";
import { imagesDirectory, upload } from "../services/upload.service";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { InternalServerError } from "../models/error.model";
import { parseRemainingFields } from "./parse.middleware";

export const uploadMiddlewares = (imageKey: string) => [
	upload.single(imageKey),
	urlencoded({ extended: true }),
	parseRemainingFields,
	(req: Request, res: Response, next: NextFunction) => {
		console.log(req.body);

		if (req.file) {
			const id = uuid();
			try {
				fs.renameSync(
					req.file.path,
					path.resolve(imagesDirectory, `${id}.png`)
				);
				req.body = { ...req.body, [imageKey]: `${id}.png` };
			} catch (e) {
				throw new InternalServerError("server error");
			}
		}else{
			req.body[imageKey] = undefined
		}
		return next();
	},
];
