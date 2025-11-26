import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import { AuthGuard } from '../auth/auth/auth.guard'; // Corrected path for AuthGuard
import { User } from '../auth/user.decorator';
import type { AuthenticatedUser } from '../auth/user.decorator'; // Import AuthenticatedUser
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Contacts')
@ApiBearerAuth('JWT-auth')
@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all contacts', description: 'Retrieve all contacts for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully', type: [Contact] })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  findAll(@User() user: AuthenticatedUser) {
    return this.contactsService.findAll(user);
  }

  // Search for contacts by name (old search functionality, now explicit)
  @Get('search-contacts')
  @ApiOperation({ summary: 'Search contacts by name', description: 'Search for contacts by their name' })
  @ApiQuery({ name: 'q', description: 'Search query string', example: 'John' })
  @ApiResponse({ status: 200, description: 'Search results returned', type: [Contact] })
  async searchContactsByName(@Query('q') query: string): Promise<Contact[]> {
    return this.contactsService.search(query);
  }

  // Search for users by email (new functionality)
  @Get('search-by-email')
  @ApiOperation({ summary: 'Search users by email', description: 'Search for users in the system by their email address to add as contacts' })
  @ApiQuery({ name: 'email', description: 'Email address to search for', example: 'jhon.doe@example.com' })
  @ApiResponse({ status: 200, description: 'User search results returned' })
  async searchUsersByEmail(@Query('email') email: string): Promise<any[]> { // Return any[] as service returns raw user data
    return this.contactsService.findByEmail(email);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Add a new contact', description: 'Add a user as a contact for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Contact successfully added' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid contact data or contact already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  create(
    @Body() createContactDto: CreateContactDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.contactsService.create(user.id, createContactDto);
  }
}

