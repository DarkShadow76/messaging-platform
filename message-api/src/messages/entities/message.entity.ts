import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Message {
  @ApiProperty({ description: 'Message ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'UUID of the message sender', example: '123e4567-e89b-12d3-a456-426614174000' })
  sender_id: string;

  @ApiProperty({ description: 'UUID of the message receiver', example: '987e6543-e21b-12d3-a456-426614174999' })
  receiver_id: string;

  @ApiProperty({ description: 'Message content text', example: 'Hello! How are you?' })
  content: string;

  @ApiPropertyOptional({ description: 'Optional URL to an image attachment', example: 'https://example.com/images/photo.jpg' })
  image_url?: string;

  @ApiProperty({ description: 'Message creation timestamp', example: '2024-01-15T10:30:00Z' })
  created_at: Date;
}
