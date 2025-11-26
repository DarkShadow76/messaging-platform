import { ApiProperty } from '@nestjs/swagger';

export class Contact {
  @ApiProperty({ description: 'Contact ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'UUID of the user who owns this contact', example: '123e4567-e89b-12d3-a456-426614174000' })
  user_id: string;

  @ApiProperty({ description: 'Contact name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'Contact avatar URL', example: 'https://example.com/avatars/johndoe.jpg' })
  avatar_url: string;
}
