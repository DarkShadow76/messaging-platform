import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({
    description: 'UUID of the user to add as a contact',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  contactUserId: string;
}
