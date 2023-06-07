import { AppDataSource } from "../models";
import { Category } from "../models/category.model";
import { ConflictError, NotFoundError } from "../models/error.model";
import { blobStringToBlobObject } from "../utils/utils";
import * as base64blob from "base64-blob";

const createNewCategory = async (name: string, image: string) => {
	const categoriesRepo = AppDataSource.getRepository(Category);

	const categoryExists = await categoriesRepo.findOneBy({ name });
	if (categoryExists) {
		throw new ConflictError(`category ${name} exists`);
	}
	const category = new Category();
	category.name = name;

	await categoriesRepo.save(category);
};

const deleteCategory = async (name: string) => {
	const categoriesRepo = AppDataSource.getRepository(Category);

	const categoryExists = await categoriesRepo.findOneBy({ name });
	if (!categoryExists) {
		throw new NotFoundError(`category to delete : not found`);
	}
	await categoriesRepo.delete({ name });
};

const updateCategory = async (prevName: string, newName: string) => {
	const categoriesRepo = AppDataSource.getRepository(Category);

	const categoryRecord = await categoriesRepo.findOneBy({ name: prevName });
	if (!categoryRecord) {
		throw new NotFoundError(`category to update : not found`);
	}
	categoryRecord.name = newName;
	await categoriesRepo.save(categoryRecord);
};

const getCategories = async () => {
	const categoriesRepo = AppDataSource.getRepository(Category);

	return (await categoriesRepo.find()).map((category) => ({
		name: category.name,
	}));
};

export const CategoriesService = {
	createNewCategory,
	deleteCategory,
	updateCategory,
	getCategories,
};
