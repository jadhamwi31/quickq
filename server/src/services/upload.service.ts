import multer from "multer";
import path from "path";
import fs from "fs";
import { InternalServerError } from "../models/error.model";

export const imagesDirectory = path.join(__dirname, "../../images/");

export const upload = multer({ dest: imagesDirectory });

export const deleteImage = (imageName: string) => {
	try {
		fs.unlinkSync(path.join(imagesDirectory, imageName));
	} catch (e) {
		console.log(e)
	}
};
