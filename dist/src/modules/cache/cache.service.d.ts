export declare class CacheService {
    private client;
    constructor();
    get(key: string): Promise<any>;
    set(key: string, value: any, options?: {
        ttl: number;
    }): Promise<void>;
}
