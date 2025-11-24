import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import { AuthGuard } from '../auth/auth/auth.guard'; // Corrected path for AuthGuard
import { User } from '../auth/user.decorator';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll(): Promise<Contact[]> {
    return this.contactsService.findAll();
  }

  // Search for contacts by name (old search functionality, now explicit)
  @Get('search-contacts')
  async searchContactsByName(@Query('q') query: string): Promise<Contact[]> {
    return this.contactsService.search(query);
  }

  // Search for users by email (new functionality)
  @Get('search-by-email')
  async searchUsersByEmail(@Query('email') email: string): Promise<any[]> { // Return any[] as service returns raw user data
    return this.contactsService.findByEmail(email);
  }

  // Add a new contact
  @Post()
  async create(@User('id') currentUserId: string, @Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactsService.create(currentUserId, createContactDto);
  }
}
