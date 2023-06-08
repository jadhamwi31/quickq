import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export const imagesDirectory = path.join(__dirname, "../../images/");

export const saveImage = (base64Image: string) => {
	if (!fs.existsSync(imagesDirectory)) {
		fs.mkdirSync(imagesDirectory);
	}
	const imageBuffer = Buffer.from(base64Image, "base64");
	const imageName = uuid();
	fs.writeFileSync(path.join(imagesDirectory, `${imageName}.png`), imageBuffer);
	return imageName;
};

export const deleteImage = (imageName: string) => {
	fs.unlinkSync(path.join(imagesDirectory, `${imageName}.png`));
};
