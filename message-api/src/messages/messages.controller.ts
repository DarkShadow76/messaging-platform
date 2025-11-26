import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { PaginationDto } from './dto/pagination.dto';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import type { User as AuthUser } from '@supabase/supabase-js';
import { User } from 'src/auth/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Messages')
@ApiBearerAuth('JWT-auth')
@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message', description: 'Send a new message to a contact' })
  @ApiResponse({ status: 201, description: 'Message successfully sent', type: Message })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid message data' })
  create(
    @Body() createMessageDto: CreateMessageDto,
    @User() user: AuthUser,
  ): Promise<Message> {
    return this.messagesService.create(createMessageDto, user.id);
  }

  @Get(':contactId')
  @ApiOperation({ summary: 'Get messages with a contact', description: 'Retrieve paginated messages between the authenticated user and a specific contact' })
  @ApiParam({ name: 'contactId', description: 'UUID of the contact', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully', type: [Message] })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  findAllByContact(
    @Param('contactId') contactId: string,
    @Query() paginationDto: PaginationDto,
    @User() user: AuthUser,
  ): Promise<Message[]> {
    return this.messagesService.findAllByContact(
      user.id,
      contactId,
      paginationDto,
    );
  }
}
