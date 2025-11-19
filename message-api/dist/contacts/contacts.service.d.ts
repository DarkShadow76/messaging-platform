import { SupabaseService } from '../supabase/supabase.service';
import { Contact } from './entities/contact.entity';
export declare class ContactsService {
    private readonly SupabaseService;
    constructor(SupabaseService: SupabaseService);
    findAll(): Promise<Contact[]>;
}
