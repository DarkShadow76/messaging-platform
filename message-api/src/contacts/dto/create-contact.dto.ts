import { IsUUID } from 'class-validator';

export class CreateContactDto {
  @IsUUID()
  contactUserId: string;
}
