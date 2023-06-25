"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
class RedisService {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = process.env.REDIS_HOST;
            const port = Number(process.env.REDIS_PORT);
            this.redis = new ioredis_1.default(port, host);
        });
    }
    static isCached(key, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hash) {
                return Boolean(yield this.redis.hexists(key, hash));
            }
            else {
                return Boolean(yield this.redis.exists(key));
            }
        });
    }
    static cacheLog(key, hash) {
        console.log("------------");
        console.log("cached version");
        console.log(`key : ${key}`);
        if (hash)
            console.log(`hash : ${hash}`);
    }
    static getCachedVersion(key, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cacheLog(key, hash);
            if (hash) {
                return yield this.redis.hget(key, hash);
            }
            else {
                return yield this.redis.get(key);
            }
        });
    }
    static clearCache() {
        return __awaiter(this, void 0, void 0, function* () {
            this.redis.del("dishes");
            this.redis.del("payments");
            this.redis.del("orders");
            this.redis.del("tables:sessions");
        });
    }
}
exports.default = RedisService;
