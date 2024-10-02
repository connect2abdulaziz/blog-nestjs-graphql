import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    // Default error response shape
    let errorResponse = {
      success: false,
      statusCode: status,
      message: 'An error occurred',

    };

    // Check if it's a custom error or an object with detailed information
    if (typeof exceptionResponse === 'string') {
      errorResponse.message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const { message, error, statusCode } = exceptionResponse as Record<string, any>;
      errorResponse = {
        success: false,
        statusCode: statusCode || status,
        message: Array.isArray(message) ? message[message.length - 1] : message || 'An error occurred',
      };
    }

    console.error('Exception caught: ', {
      statusCode: status,
      errorResponse,
      exceptionMessage: exception.message,
    });

    // Send a structured response
    return response.status(status).json(errorResponse);
  }
}
