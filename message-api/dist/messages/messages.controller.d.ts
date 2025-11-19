import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { PaginationDto } from './dto/pagination.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import type { User as AuthUser } from '@supabase/supabase-js';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto, user: AuthUser): Promise<Message>;
    findAllByContact(contactId: string, paginationDto: PaginationDto): Promise<Message[]>;
}
