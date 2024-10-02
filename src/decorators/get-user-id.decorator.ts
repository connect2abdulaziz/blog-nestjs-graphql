import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error('User not found');
    }
    return parseInt(request.user.id);
  },
);
