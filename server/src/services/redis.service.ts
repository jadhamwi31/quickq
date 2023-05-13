import Redis from "ioredis";

export default class RedisService {
	public static redis: Redis;

	public static async connect() {
		const host = process.env.REDIS_HOST;
		const port = Number(process.env.REDIS_PORT);
		this.redis = new Redis(port, host);
	}

	public static publishTo_table_id_orders = async (
		tableId: number,
		msg: object
	) => {
		await RedisService.redis.publish(
			`table:${tableId}:orders`,
			JSON.stringify(msg)
		);
	};

	public static publishTo_orders = async (msg: object) => {
		await RedisService.redis.publish(`orders`, JSON.stringify(msg));
	};
}
