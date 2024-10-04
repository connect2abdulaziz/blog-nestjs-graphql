import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ErrorMessages } from 'src/constants/messages.constants';

// Custom decorator to extract user ID from the request
export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const { user } = gqlCtx.getContext().req; 

    if (!user) {
      throw new NotFoundException(ErrorMessages.TOKEN_EXPIRED);
    }
    
    return parseInt(user.id);
  },
);
