import express from "express";
import { seedDatabase } from "./config/seed";
import dotenv from "dotenv";
import { createAppDataSource } from "./models";

dotenv.config();

(async function () {
	await createAppDataSource();
	const app = express();

	app.listen(80, () => {
		console.log(`Listening on port 80`);
	});
})();
