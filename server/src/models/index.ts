import { DataSource } from "typeorm";
import { User } from "./user.model";

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
		logging: true,
		entities: [User],
	});

	await AppDataSource.initialize();

	return AppDataSource;
};
