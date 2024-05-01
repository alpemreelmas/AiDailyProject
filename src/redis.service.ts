import { Injectable } from '@nestjs/common';
import { createClient, RedisClientOptions } from 'redis';

@Injectable()
export class RedisService {
  private client;

  constructor() {
    const redisConfig: RedisClientOptions = {
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    };
    this.client = createClient(redisConfig);

    this.client.connect();

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (err) {
      console.error('Redis ping error:', err);
      return false;
    }
  }

  close() {
    this.client.quit();
  }
}
