import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Message } from './entities/message.entity';
import { PaginationDto } from './dto/pagination.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createMessageDto: CreateMessageDto, senderId: string): Promise<Message> {
    const { receiver_id, content } = createMessageDto;
    const { data, error } = await this.supabaseService
      .getClient()
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id,
        content,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findAllByContact(
    contactId: string,
    paginationDto: PaginationDto,
  ): Promise<Message[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    const { data, error } = await this.supabaseService
      .getClient()
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${contactId},receiver_id.eq.${contactId}`)
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
