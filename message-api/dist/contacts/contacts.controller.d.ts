import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    findAll(): Promise<Contact[]>;
}
