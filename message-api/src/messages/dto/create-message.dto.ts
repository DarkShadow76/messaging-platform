import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  receiver_id: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
