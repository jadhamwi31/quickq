import { AppDataSource } from "../models";
import { Brand } from "../models/brand.model";
import { BadRequestError, NotFoundError } from "../models/error.model";
import { deleteImage } from "./upload.service";

const setBrand = async (brand: Partial<Brand>) => {
	const brandRepository = AppDataSource.getRepository(Brand);

	const brandRecord = (await brandRepository.findOneBy({})) ?? new Brand();

	brandRecord.name = brand.name;
	if (brand.slogan) brandRecord.slogan = brand.slogan;
	if (brand.logo) {
		if (brandRecord.logo) deleteImage(brandRecord.logo);
		brandRecord.logo = brand.logo;
	}

	await brandRepository.save(brandRecord);
};

const getBrand = async () => {
	const brandRepository = AppDataSource.getRepository(Brand);
	const brandRecord = await brandRepository.findOneBy({});

	return brandRecord;
};

export const BrandService = {
	setBrand,
	getBrand,
};
