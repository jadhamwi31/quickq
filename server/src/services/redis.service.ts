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

	public static cacheLog(key: string, hash?: string) {
		const hashString = hash ? ` : ${hash}` : ``
		const logStr = `Cached ${key}${hashString}`

		console.log(logStr)
	}
	public static async getCachedVersion(key: string, hash?: string) {
		this.cacheLog(key, hash);
		if (hash) {
			return await this.redis.hget(key, hash);
		} else {
			return await this.redis.get(key);
		}
	}

	public static async clearCache() {
		await this.redis.flushall()
	}
}
