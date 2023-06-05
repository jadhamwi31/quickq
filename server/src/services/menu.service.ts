import { isUndefined } from "lodash";
import { AppDataSource } from "../models";
import { Category, CategoryOrder } from "../models/category.model";
import { ConflictError, NotFoundError } from "../models/error.model";
import { MenuCustomization } from "../models/menu_customization.model";
import {
	IMenuCustomization,
	IMenuCustomizationReformed,
} from "../ts/interfaces/menu.interfaces";
import { RedisDishesType } from "../ts/types/dish.types";
import { DishesService } from "./dishes.service";
import RedisService from "./redis.service";

const addMenuCustomization = async (menu: IMenuCustomization) => {
	const menuCustomizationsRepository =
		AppDataSource.getRepository(MenuCustomization);

	const customizationWithSameNameExists =
		await menuCustomizationsRepository.findOneBy({ name: menu.name });
	if (customizationWithSameNameExists) {
		throw new ConflictError("customization with same name exists");
	}
	const menuCustomization = new MenuCustomization();
	menuCustomization.active = false;
	menuCustomization.name = menu.name;
	menuCustomization.styles = JSON.stringify({
		body: menu.body,
		category: menu.category,
		item: menu.item,
	});
	await menuCustomizationsRepository.save(menuCustomization);

	if (menu.categories_order) {
		const categoriesOrderRepository =
			AppDataSource.getRepository(CategoryOrder);
		const categoriesRepository = AppDataSource.getRepository(Category);
		const categoriesOrder: CategoryOrder[] = [];

		for (const [index, currentCategory] of menu.categories_order.entries()) {
			const category = await categoriesRepository.findOneBy({
				name: currentCategory,
			});
			if (!category) {
				await menuCustomizationsRepository.delete(menuCustomization);
				throw new NotFoundError(`category ${currentCategory} was not found`);
			}
			const categoryOrder = new CategoryOrder();
			categoryOrder.category = category;
			categoryOrder.order = index;
			categoryOrder.menuCustomization = menuCustomization;
			categoriesOrder.push(categoryOrder);
		}
		await categoriesOrderRepository.save(categoriesOrder);
	}
};

const updateMenuCustomization = async (
	name: string,
	menu: IMenuCustomizationReformed
) => {
	const menuCustomizationsRepository =
		AppDataSource.getRepository(MenuCustomization);

	const menuCustomization = await menuCustomizationsRepository.findOneBy({
		name,
	});
	if (!menuCustomization) {
		throw new NotFoundError(`customization ${name} not found`);
	}

	const prevActive = menuCustomization.active;

	if (menu.active)
		await menuCustomizationsRepository
			.createQueryBuilder()
			.update(MenuCustomization)
			.where({ active: true })
			.set({ active: false })
			.execute();
	if (!isUndefined(menu.active)) menuCustomization.active = menu.active;
	if (menu.name) menuCustomization.name = menu.name;
	menuCustomization.styles = JSON.stringify({
		body: menu.body ?? JSON.parse(menuCustomization.styles).body,
		category: menu.category ?? JSON.parse(menuCustomization.styles).category,
		item: menu.item ?? JSON.parse(menuCustomization.styles).item,
	});

	await menuCustomizationsRepository.save(menuCustomization);

	if (menu.categories_order) {
		const categoriesOrderRepository =
			AppDataSource.getRepository(CategoryOrder);
		const categoriesRepository = AppDataSource.getRepository(Category);
		const categoriesOrder: CategoryOrder[] = [];

		for (const [index, currentCategory] of menu.categories_order.entries()) {
			const category = await categoriesRepository.findOneBy({
				name: currentCategory,
			});
			if (!category) {
				await menuCustomizationsRepository.delete(menuCustomization);
				throw new NotFoundError(`category ${currentCategory} was not found`);
			}
			const categoryOrder = await categoriesOrderRepository.findOne({
				where: { category, menuCustomization },
				relations: { category: true, menuCustomization: true },
			});
			if (categoryOrder) {
				categoryOrder.order = index;
				categoriesOrder.push(categoryOrder);
			} else {
				const newCategoryOrder = new CategoryOrder();
				newCategoryOrder.order = index;
				newCategoryOrder.menuCustomization = menuCustomization;
				newCategoryOrder.category = category;
				categoriesOrder.push(newCategoryOrder);
			}
		}
		await categoriesOrderRepository.save(categoriesOrder);
	}

	if (prevActive && !isUndefined(menu.active) && !menu.active) {
		await RedisService.redis.del("menu:customizations:active");
	} else if (menu.active) {
		const {
			body,
			item,
			category,
		}: Pick<IMenuCustomization, "body" | "item" | "category"> = JSON.parse(
			menuCustomization.styles
		);

		const redisMenuCustomization: IMenuCustomization = {
			body,
			item,
			category,
			name: menuCustomization.name,
		};
		if (menuCustomization.categories_order) {
			redisMenuCustomization.categories_order =
				menuCustomization.categories_order.map(
					(categoryOrder) => categoryOrder.category.name
				);
		}
		await RedisService.redis.set(
			"menu:customizations:active",
			JSON.stringify(redisMenuCustomization)
		);
	}
};

const deleteMenuCustomization = async (name: string) => {
	const menuCustomizationsRepository =
		AppDataSource.getRepository(MenuCustomization);
	const menuCustomizationRecord = await menuCustomizationsRepository.findOneBy({
		name,
	});
	if (!menuCustomizationRecord) {
		throw new NotFoundError(`menu customization with name ${name} not found`);
	}

	if (menuCustomizationRecord.active) {
		await RedisService.redis.del("menu:customizations:active");
	}
	await menuCustomizationsRepository.delete(menuCustomizationRecord);
};

const getActiveMenu = async () => {
	const isActiveMenuCustomizationsCached = await RedisService.isCached(
		"menu:customizations:active"
	);
	let activeMenuCustomization: IMenuCustomization;
	if (isActiveMenuCustomizationsCached) {
		activeMenuCustomization = JSON.parse(
			await RedisService.getCachedVersion("menu:customizations:active")
		);
	} else {
		const _activeMenuCustomization = await AppDataSource.getRepository(
			MenuCustomization
		)
			.createQueryBuilder("menu_customization")
			.leftJoinAndSelect(
				"menu_customization.categories_order",
				"category_order"
			)
			.where("menu_customization.active = :active", { active: true })
			.leftJoinAndSelect("category_order.category", "category")
			.orderBy("category_order.order", "ASC")
			.select()
			.getOne();

		if (_activeMenuCustomization) {
			const {
				body,
				item,
				category,
			}: Pick<IMenuCustomization, "body" | "item" | "category"> = JSON.parse(
				_activeMenuCustomization.styles
			);

			activeMenuCustomization = {
				body,
				item,
				category,
				name: _activeMenuCustomization.name,
			};
			if (_activeMenuCustomization.categories_order) {
				activeMenuCustomization.categories_order =
					_activeMenuCustomization.categories_order.map(
						(categoryOrder) => categoryOrder.category.name
					);
			}
			await RedisService.redis.set(
				"menu:customizations:active",
				JSON.stringify(activeMenuCustomization)
			);
		} else {
			activeMenuCustomization = null;
		}
	}
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

	return { categories, menu: activeMenuCustomization };
};

const getMenuCustomizations = async () => {
	const menuCustomizations = await AppDataSource.getRepository(
		MenuCustomization
	)
		.createQueryBuilder("menu_customization")
		.leftJoinAndSelect("menu_customization.categories_order", "category_order")
		.leftJoinAndSelect("category_order.category", "category")
		.orderBy("category_order.order", "ASC")
		.select()
		.getMany();

	return menuCustomizations.map((customization) => ({
		...customization,
		styles: JSON.parse(customization.styles),
	}));
};

export const MenuService = {
	addMenuCustomization,
	getActiveMenu,
	deleteMenuCustomization,
	updateMenuCustomization,
	getMenuCustomizations,
};
