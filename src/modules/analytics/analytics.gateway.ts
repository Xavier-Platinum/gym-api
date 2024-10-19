import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AnalyticsService } from './analytics.service';

@WebSocketGateway()
export class AnalyticsGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly analyticsService: AnalyticsService) {}

  @SubscribeMessage('analyticsUpdates')
  async handleAnalyticsUpdates(client: any, payload: any) {
    const analytics = await this.analyticsService.getAnalytics(
      payload.filter,
      payload.pagination,
    );
    this.server.emit('analyticsData', analytics);
  }
}
