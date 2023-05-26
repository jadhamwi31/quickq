import fs from "fs";
import path from "path";
import { AppDataSource } from "../models";
import { Category } from "../models/category.model";
import { BadRequestError, InternalServerError } from "../models/error.model";
import { IMenu } from "../ts/interfaces/menu.interfaces";
import RedisService from "./redis.service";
import { DishesService } from "./dishes.service";
import { RedisDishesType } from "../ts/types/dish.types";

const menuCustomizationPath = path.join(__dirname, "../../menu.json");

const createMenu = async (menu: IMenu) => {
	const categories = await AppDataSource.getRepository(Category).find({
		select: { name: true },
	});
	menu.body.categoriesOrder.forEach((category) => {
		if (
			categories.findIndex(
				(currentCategory) => currentCategory.name === category
			) < 0
		) {
			throw new BadRequestError(`category ${category} does not exist`);
		}
	});
	const jsonMenu = JSON.stringify(menu);
	try {
		fs.writeFileSync(menuCustomizationPath, jsonMenu);
	} catch (e) {
		throw new InternalServerError("server error: couldn't create the menu");
	}
};

const getMenu = async () => {
	try {
		const menu: IMenu = JSON.parse(
			fs.readFileSync(menuCustomizationPath, { encoding: "utf8", flag: "r" })
		);

		const dishes = await DishesService.getDishes();

		const categories: { [category: string]: RedisDishesType } = {};

		dishes.forEach((dish) => {
			const dishCategory = dish.category;
			delete dish.category;
			if (categories[dishCategory]) {
				categories[dishCategory].push(dish);
			} else {
				categories[dishCategory] = [];
				categories[dishCategory].push(dish);
			}
		});

		return { categories, menu };
	} catch (e) {
		throw new InternalServerError("server error: couldn't read menu");
	}
};

export const MenuService = { createMenu, getMenu };
