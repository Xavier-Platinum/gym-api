import { AnalyticsService } from './analytics.service';
import { PackagesService } from '../users/services/packages/packages.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    private readonly subscribers;
    constructor(analyticsService: AnalyticsService, subscribers: PackagesService);
    getAnalytics(filter: any, page?: number, limit?: number, sort?: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllSubscribers(filter: any, page?: number, limit?: number, sort?: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
