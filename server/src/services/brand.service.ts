import { AppDataSource } from "../models";
import { Brand } from "../models/brand.model";
import { BadRequestError, NotFoundError } from "../models/error.model";
import { deleteImage, saveImage } from "./upload.service";

const createNewBrand = async (brand: Brand) => {
	const brandRepository = AppDataSource.getRepository(Brand);

	const brandExists = (await brandRepository.find()).length === 1;
	if (brandExists) {
		throw new BadRequestError("brand already exists");
	}

	const newBrand = new Brand();
	if (brand.logo) {
		newBrand.logo = saveImage(brand.logo);
	}
	if (brand.slogan) {
		newBrand.slogan = brand.slogan;
	}
	newBrand.name = brand.name;
	await brandRepository.save(newBrand);
};

const updateBrand = async (brand: Partial<Brand>) => {
	const brandRepository = AppDataSource.getRepository(Brand);

	const brandRecord = await brandRepository.findOne({});
	if (!brandRecord) {
		throw new BadRequestError("brand already exists");
	}
	if (brand.name) {
		brandRecord.name = brand.name;
	}

	if (brand.logo) {
		deleteImage(brandRecord.logo);
		brandRecord.logo = saveImage(brand.logo);
	}
	if (brand.slogan) {
		brandRecord.slogan = brand.slogan;
	}

	await brandRepository.save(brandRecord);
};

const deleteBrand = async () => {
	const brandRepository = AppDataSource.getRepository(Brand);
	const brandRecord = await brandRepository.findOne({});
	if (!brandRecord) {
		throw new NotFoundError("brand not found");
	}
	if (brandRecord.logo) deleteImage(brandRecord.logo);
	await brandRepository.delete(brandRecord);
};

const getBrand = async () => {
	const brandRepository = AppDataSource.getRepository(Brand);
	const brandRecord = await brandRepository.findOne({});

	return brandRecord;
};

export const BrandService = {
	createNewBrand,
	updateBrand,
	deleteBrand,
	getBrand,
};
