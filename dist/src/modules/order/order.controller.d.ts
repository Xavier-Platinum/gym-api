import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(payload: any | CreateOrderDto, req: {
        user: any;
    }): Promise<void>;
    findAll(payload: any): Promise<any>;
    findUserOrders(payload: any, req: {
        user: any;
    }): Promise<any>;
    findById(id: any): Promise<any>;
    update(id: any, payload: UpdateOrderDto): Promise<import("./entities/order.schema").Order>;
}
