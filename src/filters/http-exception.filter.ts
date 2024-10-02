import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class GraphqlHttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = GqlArgumentsHost.create(host);
    const response = ctx.getContext().res;
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    // Default error response shape
    let errorResponse = {
      status: status,
      message: 'An error occurred',
      stack: exception.stack, // Include stack trace
    };

    // Check if it's a custom error or an object with detailed information
    if (typeof exceptionResponse === 'string') {
      errorResponse.message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const { message, error } = exceptionResponse as Record<string, any>;
      errorResponse = {
        status: status,
        message: Array.isArray(message) ? message[message.length - 1] : message || 'An error occurred',
        stack: exception.stack, // Include stack trace
      };
    }

    console.error('GraphQL Exception caught: ', {
      statusCode: status,
      errorResponse,
      exceptionMessage: exception.message,
    });

    // Return the error response in the format expected by GraphQL
    return new GraphQLError(errorResponse.message, {
      extensions: {
        code: 'BAD_REQUEST', // Change this to appropriate code if needed
        status: status,
        stack: errorResponse.stack,
        success: false,
      },
    });
  }
}
