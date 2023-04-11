import { AppDataSource } from "../models";
import { ConflictError } from "../models/error.model";
import { Table } from "../models/table.model";

const createNewTable = async (id: number) => {
	const tablesRepo = AppDataSource.getRepository(Table);

	const tableExists = await tablesRepo.findOneBy({ id });
	if (tableExists) {
		throw new ConflictError("table with this id already exists");
	}
	await tablesRepo.insert({ id, status: "Available" });
};

export const TablesService = { createNewTable };
