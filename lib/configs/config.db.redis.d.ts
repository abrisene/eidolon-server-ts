import Redis from 'ioredis';
export declare const key = "redis";
export declare const category = "database";
export default function configure(): Promise<{
    url: string;
    client: Redis.Redis;
}>;
//# sourceMappingURL=config.db.redis.d.ts.map