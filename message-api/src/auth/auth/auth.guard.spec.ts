import { AuthGuard } from './auth.guard';
import { SupabaseService } from '../../supabase/supabase.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let supabaseService: jest.Mocked<SupabaseService>;

  beforeEach(() => {
    // Create a mock SupabaseService
    supabaseService = {
      getClient: jest.fn(),
    } as any;

    guard = new AuthGuard(supabaseService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
