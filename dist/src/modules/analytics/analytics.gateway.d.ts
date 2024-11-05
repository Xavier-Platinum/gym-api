import { Server } from 'socket.io';
import { AnalyticsService } from './analytics.service';
export declare class AnalyticsGateway {
    private readonly analyticsService;
    server: Server;
    constructor(analyticsService: AnalyticsService);
    handleAnalyticsUpdates(client: any, payload: any): Promise<void>;
}
