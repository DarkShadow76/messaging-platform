import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';

export interface AuthenticatedUser extends SupabaseAuthUser {
  access_token: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

