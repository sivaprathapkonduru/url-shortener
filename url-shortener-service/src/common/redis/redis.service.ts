import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import configuration from 'config/configuration';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    const redisCreds = configuration().db.redis;
    this.redisClient = new Redis({
      host: redisCreds.host,
      port: redisCreds.port,
      username: redisCreds.username,
      password: redisCreds.password,
      db: redisCreds.db,
    });
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    if (expireSeconds) {
      await this.redisClient.set(key, value, 'EX', expireSeconds);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}