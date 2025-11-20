import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll(): Promise<Contact[]> {
    return this.contactsService.findAll();
  }

  @Get('search')
  async search(@Query('q') query: string): Promise<Contact[]> {
    return this.contactsService.search(query);
  }
}
