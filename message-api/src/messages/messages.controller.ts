import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { PaginationDto } from './dto/pagination.dto';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import type { User as AuthUser } from '@supabase/supabase-js';
import { User } from 'src/auth/user.decorator';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @User() user: AuthUser,
  ): Promise<Message> {
    return this.messagesService.create(createMessageDto, user.id);
  }

  @Get(':contactId')
  findAllByContact(
    @Param('contactId') contactId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<Message[]> {
    return this.messagesService.findAllByContact(contactId, paginationDto);
  }
}
