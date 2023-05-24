import Redis from "ioredis";

export default class RedisService {
	public static redis: Redis;

	public static async connect() {
		const host = process.env.REDIS_HOST;
		const port = Number(process.env.REDIS_PORT);
		this.redis = new Redis(port, host);
	}
}
