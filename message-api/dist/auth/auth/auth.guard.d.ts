import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
export declare class AuthGuard implements CanActivate {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
