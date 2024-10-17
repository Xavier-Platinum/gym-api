import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsGateway } from './subscriptions.gateway';

describe('SubscriptionsGateway', () => {
  let gateway: SubscriptionsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionsGateway],
    }).compile();

    gateway = module.get<SubscriptionsGateway>(SubscriptionsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
