import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  receiver_id: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}
