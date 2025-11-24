import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly SupabaseService: SupabaseService) {}

  async create(currentUserId: string, createContactDto: CreateContactDto): Promise<Contact> {
    const { contactUserId } = createContactDto;
    const adminClient = this.SupabaseService.getAdminClient();

    // 1. Verify contactUserId exists in public.users
    const { data: contactUser, error: userError } = await adminClient
      .from('users')
      .select('id, full_name, avatar_url')
      .eq('id', contactUserId)
      .single();

    if (userError || !contactUser) {
      throw new BadRequestException('Contact user not found.');
    }

    // 2. Check if contact already exists for the current user
    const { data: existingContact, error: existingContactError } = await adminClient
      .from('contacts')
      .select('*')
      .eq('user_id', currentUserId)
      .eq('contact_user_id', contactUserId)
      .single();

    if (existingContactError && existingContactError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error checking existing contact:', existingContactError);
      throw new BadRequestException('Error checking existing contact.');
    }

    if (existingContact) {
      throw new BadRequestException('Contact already exists.');
    }

    // 3. Insert new contact
    const { data, error: insertError } = await adminClient
      .from('contacts')
      .insert({
        user_id: currentUserId,
        contact_user_id: contactUserId,
        name: contactUser.full_name || contactUser.id, // Use full_name or id as fallback
        avatar_url: contactUser.avatar_url || null, // Use avatar_url or null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting contact:', insertError);
      throw new BadRequestException('Failed to add contact.');
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

  async findByEmail(email: string): Promise<any[]> {
    if (!email) {
      return [];
    }
    console.log(`Searching for email matching: ${email}`);
    const adminClient = this.SupabaseService.getAdminClient();
    
    const { data: users, error: userError } = await adminClient
      .from('users') // Search public.users
      .select('id, email, full_name, phone_number, avatar_url') // Select relevant fields
      .ilike('email', `%${email}%`); // Case-insensitive partial match

    if (userError) {
      console.error('Error searching public.users:', userError);
      throw new Error(`Error searching public.users: ${userError.message}`);
    }

    console.log(`Found ${users?.length} matching users in public.users for "${email}"`);
    return users; // Return the raw user data from public.users
  }  
}
