import { SupabaseService } from '../supabase/supabase.service';
import { Message } from './entities/message.entity';
import { PaginationDto } from './dto/pagination.dto';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    create(createMessageDto: CreateMessageDto, senderId: string): Promise<Message>;
    findAllByContact(contactId: number, paginationDto: PaginationDto): Promise<Message[]>;
}
