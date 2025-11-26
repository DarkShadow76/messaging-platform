import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { User, Session } from '@supabase/supabase-js'; // Import User and Session types

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const { data, error} = await this.supabaseService
    .getClient()
    .auth.getUser(token)
    .catch(() => {
      throw new UnauthorizedException('Invalid token' + error);
    });

    // Assert the type of data to include the session property
    const authDataWithSession = data as { user: User; session: Session | null; };

    request['user'] = {
      ...authDataWithSession.user,
      access_token: token, // Use the extracted token directly
    };


    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
