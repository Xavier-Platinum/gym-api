import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const errorResponse = {
      statusCode: status,
      message: this.getErrorMessage(exceptionResponse),
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };

    console.error('Exception:', exception); // Log the full error for debugging

    // Send the response
    response.status(status).json(errorResponse);
  }

  private getErrorMessage(response: any): string {
    // If the exception has a detailed message, extract it
    if (typeof response === 'string') {
      return response;
    }

    if (Array.isArray(response.message)) {
      return response.message.join(', ');
    }

    return response.message || 'Unexpected error occurred';
  }
}
