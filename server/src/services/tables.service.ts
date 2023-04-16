import { uniqueId } from "lodash";
import { AppDataSource } from "../models";
import { ConflictError, NotFoundError } from "../models/error.model";
import { Table, TableCode } from "../models/table.model";
import { TableStatus } from "../ts/types/table.types";
import { v4 as uuid } from "uuid";
const createNewTable = async (id: number) => {
	const tablesRepo = AppDataSource.getRepository(Table);
	const tablesCodesRepo = AppDataSource.getRepository(TableCode);
	const tableExists = await tablesRepo.findOneBy({ id });
	if (tableExists) {
		throw new ConflictError("table with this id already exists");
	}
	const tableRecord = new Table();
	const tableCodeRecord = new TableCode();
	try {
		tableRecord.id = id;
		tableRecord.status = "Available";
		await tablesRepo.insert(tableRecord);
		tableCodeRecord.code = uuid();
		tableCodeRecord.table = tableRecord;

		await tablesCodesRepo.insert(tableCodeRecord);
		return tableCodeRecord.code;
	} catch (e) {
		tablesRepo.remove(tableRecord);
		tablesCodesRepo.remove(tableCodeRecord);
	}
};

const updateTable = async (id: number, status: TableStatus) => {
	const tablesRepo = AppDataSource.getRepository(Table);

	const tableRecord = await tablesRepo.findOneBy({ id });
	if (!tableRecord) {
		throw new NotFoundError("table with this id doesn't exist");
	}
	tableRecord.status = status;
	await tablesRepo.save(tableRecord);
};

const deleteTable = async (id: number) => {
	const tablesRepo = AppDataSource.getRepository(Table);

	const tableRecord = await tablesRepo.findOneBy({ id });
	if (!tableRecord) {
		throw new NotFoundError("table with this id doesn't exist");
	}
	await tablesRepo.delete(tableRecord);
};

const getTables = async (): Promise<Table[]> => {
	const tablesRepo = AppDataSource.getRepository(Table);

	const tables = await tablesRepo.find();
	return tables;
};

export const TablesService = {
	createNewTable,
	updateTable,
	deleteTable,
	getTables,
};
