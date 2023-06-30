import { QueryFailedError } from "typeorm";
import { createAppDataSource } from "../models";
import { User } from "../models/user.model";
const seeds = require("./seeds.json");
import dotenv from "dotenv";
dotenv.config();

export const seedDatabase = async () => {
	const { users } = seeds;

	const AppDataSource = await createAppDataSource();
	try {
		const usersRecords = await AppDataSource.getRepository(User).find();

		if (usersRecords.length === 0) {
			await AppDataSource.getRepository(User).save(users);
		}
	} catch (e) {
		console.log(e);
	} finally {
		AppDataSource.destroy();
	}
};

seedDatabase();
