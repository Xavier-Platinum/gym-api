import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class CacheService {
  private client: Redis.Redis;

  // NOTE:  After debug put this data into environment variables
  constructor() {
    this.client = new Redis.Redis({
      host: 'redis-10437.c82.us-east-1-2.ec2.redns.redis-cloud.com',
      port: 10437, // 6379
      password: 'JyoTEqz9n9Sso7yQ0reyVAHHSJ7mC2M6',
    });
  }

  async get(key: string) {
    return JSON.parse(await this.client.get(key));
  }

  async set(key: string, value: any, options = { ttl: 600 }) {
    await this.client.set(key, JSON.stringify(value), 'EX', options.ttl);
  }
}
