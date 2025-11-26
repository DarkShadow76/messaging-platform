import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'UUID of the message receiver',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  receiver_id: string;

  @ApiProperty({
    description: 'Message content text',
    example: 'Hello! How are you?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Optional URL to an image attachment',
    example: 'https://example.com/images/photo.jpg',
  })
  @IsString()
  @IsOptional()
  image_url?: string;
}
