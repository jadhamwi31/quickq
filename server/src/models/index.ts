import { DataSource } from "typeorm";
import { User } from "./user.model";
import { Dish } from "./dish.model";
import { Ingredient } from "./ingredient.model";
import { DishIngredient, OrderDish } from "./shared.model";
import { Category } from "./category.model";
import { Table, TableCode, TableSession } from "./table.model";
import { Order } from "./order.model";
import { Payment } from "./payment.model";
import { InventoryItem } from "./inventory_item.model";
import { MenuCustomization } from "./menu_customization.model";
import { Brand } from "./brand.model";

export let AppDataSource: DataSource;

export const createAppDataSource = async () => {
	const { DB_NAME, DB_HOST, DB_PORT, DB_PASSWORD, DB_USERNAME } = process.env;

	AppDataSource = new DataSource({
		type: "postgres",
		username: DB_USERNAME,
		password: DB_PASSWORD,
		host: DB_HOST,
		port: Number(DB_PORT),
		database: DB_NAME,
		synchronize: true,
		logging: false,
		entities: [
			User,
			Dish,
			Ingredient,
			DishIngredient,
			Category,
			Table,
			OrderDish,
			Order,
			Payment,
			TableCode,
			InventoryItem,
			TableSession,
			MenuCustomization,
			Brand,
		],
	});

	await AppDataSource.initialize();

	return AppDataSource;
};
