import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(private readonly SupabaseService: SupabaseService) {}

  async findAll(): Promise<Contact[]> {
    const { data, error } = await this.SupabaseService
      .getClient()
      .from('contacts')
      .select('*');

    if (error) {
      throw new Error(`Error fetching contacts: ${error.message}`);
    }

    return data;
  }

  async search(query: string): Promise<Contact[]> {
    const { data, error } = await this.SupabaseService
      .getClient()
      .from('contacts')
      .select('*')
      .ilike('name', `%${query}%`);

    if (error) {
      throw new Error(`Error searching contacts: ${error.message}`);
    }

    return data;
  }
}
