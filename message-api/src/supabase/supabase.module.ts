import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService],
  imports: [ConfigModule],
  exports: [SupabaseService],
})
export class SupabaseModule {}
