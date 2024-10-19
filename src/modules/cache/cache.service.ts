import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class CacheService {
  private client: Redis.Redis;

  constructor() {
    this.client = new Redis.Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async get(key: string) {
    return JSON.parse(await this.client.get(key));
  }

  async set(key: string, value: any, options = { ttl: 600 }) {
    await this.client.set(key, JSON.stringify(value), 'EX', options.ttl);
  }
}
