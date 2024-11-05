import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    private logger;
    constructor(configService: ConfigService);
    sendMail(to: string, subject: string, text: string, html?: string, attachments?: any[]): Promise<any>;
}
