import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import { AuthGuard } from '../auth/auth/auth.guard'; // Corrected path for AuthGuard
import { User } from '../auth/user.decorator';
import type { AuthenticatedUser } from '../auth/user.decorator'; // Import AuthenticatedUser
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User() user: AuthenticatedUser) {
    return this.contactsService.findAll(user);
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

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createContactDto: CreateContactDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.contactsService.create(user.id, createContactDto);
  }
}

