import Redis from "ioredis";

export default class RedisService {
	public static redis: Redis;

	public static async connect() {
		const host = process.env.REDIS_HOST;
		const port = Number(process.env.REDIS_PORT);
		this.redis = new Redis(port, host);
	}

	public static async isCached(key: string, hash?: string) {
		if (hash) {
			return Boolean(await this.redis.hexists(key, hash));
		} else {
			return Boolean(await this.redis.exists(key));
		}
	}

	public static async getCachedVersion(key: string, hash?: string) {
		if (hash) {
			return await this.redis.hget(key, hash);
		} else {
			return await this.redis.get(key);
		}
	}
}
