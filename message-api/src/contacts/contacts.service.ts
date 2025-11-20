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

  async findByEmail(email: string): Promise<Contact[]> {
    const adminClient = this.SupabaseService.getAdminClient();
    
    // 1. Find users by email using admin auth client (partial match)
    const { data: { users }, error: userError } = await adminClient.auth.admin.listUsers();
    
    if (userError) {
      throw new Error(`Error listing users: ${userError.message}`);
    }

    const matchedUsers = users.filter((u: any) => u.email?.toLowerCase().includes(email.toLowerCase()));

    if (matchedUsers.length === 0) {
      return [];
    }

    const userIds = matchedUsers.map(u => u.id);

    // 2. Get contact details for these users
    const { data: contacts, error: contactError } = await this.SupabaseService
      .getClient()
      .from('contacts')
      .select('*')
      .in('user_id', userIds);

    if (contactError) {
      return []; 
    }

    return contacts;
  }
}
