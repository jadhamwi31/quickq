import fs from "fs";
import path from "path";
import {
	BadRequestError,
	InternalServerError,
	NotFoundError,
} from "../models/error.model";
import {
	IMenuCustomization,
	IMenuCustomizationReformed,
} from "../ts/interfaces/menu.interfaces";
import { RedisDishesType } from "../ts/types/dish.types";
import { MenuStyleStatus as MenuCustomizationStatus } from "../ts/types/menu.types";
import { DishesService } from "./dishes.service";
import RedisService from "./redis.service";

const menuCustomizationsPath = path.join(
	__dirname,
	"../../menu_customizations.json"
);

const addMenuCustomization = async (menu: IMenuCustomization) => {
	const menuCustomizationsExist = fs.existsSync(menuCustomizationsPath);
	if (!menuCustomizationsExist) {
		fs.writeFileSync(menuCustomizationsPath, JSON.stringify([]));
	}

	const menuCustomizations: IMenuCustomizationReformed[] = JSON.parse(
		fs.readFileSync(menuCustomizationsPath, { encoding: "utf8", flag: "r" })
	);

	const isThereActiveMenuCustomization = menuCustomizations.find(
		(menu) => menu.status === "active"
	);
	let newMenu: IMenuCustomizationReformed;
	if (isThereActiveMenuCustomization) {
		newMenu = { ...menu, status: "in-active" };
	} else {
		newMenu = { ...menu, status: "active" };
	}
	const newMenuCustomizations = [...menuCustomizations, newMenu];
	fs.writeFileSync(
		menuCustomizationsPath,
		JSON.stringify(newMenuCustomizations, null, 2)
	);
	RedisService.redis.set(
		"menu:customizations",
		JSON.stringify(newMenuCustomizations)
	);
};

const updateMenuCustomization = async (
	name: string,
	menu: IMenuCustomizationReformed
) => {
	const menuCustomizationsExist = fs.existsSync(menuCustomizationsPath);
	if (!menuCustomizationsExist) {
		throw new BadRequestError("no menu customizations exist");
	}

	const menuCustomizations: IMenuCustomizationReformed[] = JSON.parse(
		fs.readFileSync(menuCustomizationsPath, { encoding: "utf8", flag: "r" })
	);

	const targetMenuCustomizationIndex = menuCustomizations.findIndex(
		(currentMenu) => currentMenu.name === name
	);

	if (targetMenuCustomizationIndex < 0) {
		throw new NotFoundError("menu customiziation with this name was not found");
	}

	const newTargetMenuCustomization = {
		...menuCustomizations[targetMenuCustomizationIndex],
		...menu,
	};

	if (menu.status) {
		const prevActiveMenuCustomizationIndex = menuCustomizations.findIndex(
			(currentMenu) => currentMenu.status === "active"
		);
		menuCustomizations[prevActiveMenuCustomizationIndex].status = "in-active";
	}

	menuCustomizations.splice(targetMenuCustomizationIndex, 1);

	const newMenuCustomizations = [
		...menuCustomizations,
		newTargetMenuCustomization,
	];

	fs.writeFileSync(
		menuCustomizationsPath,
		JSON.stringify(newMenuCustomizations, null, 2)
	);

	RedisService.redis.set(
		"menu:customizations",
		JSON.stringify(newMenuCustomizations)
	);
};

const getMenu = async () => {
	try {
		const areMenuCustomizationsCached = await RedisService.isCached(
			"menu:customizations"
		);

		let menuCustomizations: IMenuCustomizationReformed[];
		if (areMenuCustomizationsCached) {
			menuCustomizations = JSON.parse(
				await RedisService.getCachedVersion("menu:customizations")
			);
		} else {
			const menuCustomizationsFromFile = fs.readFileSync(
				menuCustomizationsPath,
				{ encoding: "utf8", flag: "r" }
			);
			await RedisService.redis.set(
				"menu:customizations",
				menuCustomizationsFromFile
			);
			menuCustomizations = JSON.parse(menuCustomizationsFromFile);
		}

		const activeMenu = menuCustomizations.find(
			(menuCustomization) => menuCustomization.status === "active"
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

		return { categories, menu: activeMenu };
	} catch (e) {
		throw new InternalServerError("server error: couldn't read menu");
	}
};

export const MenuService = {
	addMenuCustomization,
	getMenu,
	updateMenuCustomization,
};
