import { AppDataSource } from "../models";
import { Category } from "../models/category.model";
import { ConflictError, NotFoundError } from "../models/error.model";
import { deleteImage } from "./upload.service";

const createNewCategory = async (name: string, image?: string) => {
	const categoriesRepo = AppDataSource.getRepository(Category);

	const categoryExists = await categoriesRepo.findOneBy({ name });
	if (categoryExists) {
		throw new ConflictError(`category ${name} exists`);
	}
	const category = new Category();
	category.name = name;
	if (image) {
		category.image = image;
	}

	await categoriesRepo.save(category);
};

const deleteCategory = async (name: string) => {
	const categoriesRepo = AppDataSource.getRepository(Category);

	const categoryRecord = await categoriesRepo.findOneBy({ name });
	if (!categoryRecord) {
		throw new NotFoundError(`category to delete : not found`);
	}
	const { image } = categoryRecord;
	if (image) {
		deleteImage(image);
	}
	await categoriesRepo.remove(categoryRecord);
};

const updateCategory = async (
	prevName: string,
	newName: string,
	image?: string
) => {
	const categoriesRepo = AppDataSource.getRepository(Category);

	const categoryRecord = await categoriesRepo.findOneBy({ name: prevName });
	if (!categoryRecord) {
		throw new NotFoundError(`category to update : not found`);
	}
	if (newName) categoryRecord.name = newName;
	if (image) {
		deleteImage(categoryRecord.image);
		categoryRecord.image = image;
	}
	await categoriesRepo.save(categoryRecord);
};

const getCategories = async () => {
	const categoriesRepo = AppDataSource.getRepository(Category);

	return (await categoriesRepo.find()).map((category) => ({
		name: category.name,
		image: category.image,
	}));
};

export const CategoriesService = {
	createNewCategory,
	deleteCategory,
	updateCategory,
	getCategories,
};
