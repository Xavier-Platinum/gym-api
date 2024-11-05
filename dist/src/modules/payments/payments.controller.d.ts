import { TransactionsService } from '../transactions/transactions.service';
export declare class PaymentsController {
    private readonly transactionService;
    constructor(transactionService: TransactionsService);
    handleFlutterwave(body: any): Promise<{
        status: string;
    }>;
    handlePaystack(body: any): Promise<{
        status: string;
    }>;
}
