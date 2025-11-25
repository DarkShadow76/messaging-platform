import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Message } from './entities/message.entity';
import { PaginationDto } from './dto/pagination.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createMessageDto: CreateMessageDto, senderId: string): Promise<Message> {
    const { receiver_id, content, image_url } = createMessageDto;
    const { data, error } = await this.supabaseService
      .getClient()
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id,
        content,
        image_url,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findAllByContact(
    userId: string,
    contactId: string,
    paginationDto: PaginationDto,
  ): Promise<Message[]> {
    console.log('findAllByContact - userId:', userId, 'contactId:', contactId);
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    const { data, error } = await this.supabaseService
      .getClient()
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`,
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
